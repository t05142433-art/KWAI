import express from 'express';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Route for Kwai Extractor
  app.post('/api/extract', async (req, res) => {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Nenhum conteúdo enviado' });
    }

    const urlMatch = content.match(/https?:\/\/[^\s]+/);
    if (!urlMatch) {
      return res.status(400).json({ error: 'Nenhum link encontrado no texto' });
    }

    const targetUrl = urlMatch[0];
    console.log(`[*] Extraindo de: ${targetUrl}`);

    try {
      const response = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': 'https://www.kwai.com/'
        },
        redirect: 'follow'
      });

      if (!response.ok) {
        throw new Error(`Falha ao acessar o Kwai: ${response.statusText}`);
      }

      const html = await response.text();
      
      // Look for .mp4 URLs
      const mp4Regex = /https:\/\/[a-zA-Z0-9.-]+\.kwai\.net\/[^\s"\' ]+\.mp4[^\s"\' ]*/g;
      let matches = html.match(mp4Regex);

      if (!matches || matches.length === 0) {
        const alternateRegex = /"video_url":"(.*?)"/i;
        const altMatch = html.match(alternateRegex);
        if (altMatch && altMatch[1]) {
           let vidUrl = altMatch[1].replace(/\\u002F/g, '/');
           matches = [vidUrl];
        }
      }

      if (matches && matches.length > 0) {
        const videoUrl = matches[0].replace(/\\u002F/g, '/');
        
        const titleMatch = html.match(/<title>(.*?)<\/title>/i);
        const title = titleMatch ? titleMatch[1] : 'Vídeo Kwai';

        // Try to get more metadata from script tags or JSON-LD
        const durationMatch = html.match(/"duration":\s*(\d+)/i);
        const duration = durationMatch ? parseInt(durationMatch[1]) : 0;
        
        // Attempt to get file size via HEAD request
        let size = 'Desconhecido';
        try {
          const headRes = await fetch(videoUrl, { method: 'HEAD' });
          const contentLength = headRes.headers.get('content-length');
          if (contentLength) {
            size = (parseInt(contentLength) / (1024 * 1024)).toFixed(2) + ' MB';
          }
        } catch (e) {
          console.warn('Could not get file size');
        }

        return res.json({
          videoUrl,
          title: title.replace(' - Kwai', '').trim(),
          originalUrl: targetUrl,
          metadata: {
            duration: duration > 0 ? `${Math.floor(duration/1000)}s` : 'Desconhecido',
            size: size
          }
        });
      }

      return res.status(404).json({ error: 'Não foi possível encontrar o vídeo na página.' });

    } catch (error: any) {
      console.error('[!] Erro na extração:', error.message);
      return res.status(500).json({ error: `Erro ao processar: ${error.message}` });
    }
  });

  // Download Proxy to force attachment behavior
  app.get('/api/download', async (req, res) => {
    const videoUrl = req.query.url as string;
    if (!videoUrl) return res.status(400).send('URL missing');

    try {
      const response = await fetch(videoUrl);
      if (!response.ok) throw new Error('Failed to fetch video');

      const contentType = response.headers.get('content-type') || 'video/mp4';
      const contentName = `kwai_video_${Date.now()}.mp4`;

      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${contentName}"`);

      // Binary stream transfer
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      res.send(buffer);
    } catch (error: any) {
      res.status(500).send('Error downloading: ' + error.message);
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
