import serverless from 'serverless-http';
import { app } from '../server.js'; // Note the .js extension for ES modules

export const handler = serverless(app);
