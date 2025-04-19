#!/usr/bin/env node
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

async function listRoutes() {
  try {
    // Import dependencies
    const express = await import('express');
    const listEndpoints = (await import('express-list-endpoints')).default;
    const columnify = (await import('columnify')).default;
    
    // Create a new express instance just for listing routes
    const app = express.default();
    
    // Apply the same middleware as your main app
    app.use(express.default.json());
    
    // Import and apply your routes
    const routes = await import('./routes/index.js');
    app.use('/api', routes.default);
    
    // Get endpoints
    const endpoints = listEndpoints(app);
    const data = [];
    
    // Format data for display
    endpoints.forEach(route => {
      route.methods.forEach(method => {
        data.push({
          Method: method,
          Path: route.path,
          Middleware: route.middlewares?.join(', ') || '-'
        });
      });
    });
    
    // Display formatted output
    console.log('\nRegistered Routes:');
    console.log(columnify(data, {
      columnSplitter: ' | ',
      config: { 
        Method: { minWidth: 8 }, 
        Path: { minWidth: 30 },
        Middleware: { maxWidth: 30 }
      }
    }));
    
    process.exit(0);
    
  } catch (error) {
    console.error('Error listing routes:', error.message);
    process.exit(1);
  }
}

listRoutes();