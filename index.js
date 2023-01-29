// Use the dotenv package, to create environment variables
const express = require('express');
const server = express();
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL ||
    'postgres://localhost/3000');

const port = process.env.PORT || 3000;

server.listen(port, async() => {
    try {
        console.log(`listening on port ${port}`);
        await client.connect();
        
    }
    catch {
        
    }
});


// Create a constant variable, PORT, based on what's in process.env.PORT or fallback to 3000

// Import express, and create a server

// Require morgan and body-parser middleware

// Have the server use morgan with setting 'dev'

// Import cors 
// Have the server use cors()

// Have the server use bodyParser.json()

// Have the server use your api router with prefix '/api'

// Import the client from your db/index.js

// Create custom 404 handler that sets the status code to 404.

// Create custom error handling that sets the status code to 500
// and returns the error as an object


// Start the server listening on port PORT
// On success, connect to the database
