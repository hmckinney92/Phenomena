// Build an apiRouter using express Router
// const express = require('express');
// const app = express();
// const pg = require('pg');
// const db = require('./db');
// const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/db');

// const port = process.env.PORT || 3000;

// app.listen(port, async ()=> {
//     console.log(`listening on port ${port}`);
//     try { 
//         console.log("connecting to DB...");
//         await client.connect();
        
//     } catch (error) {
//         console.error(error);
//         console.log("Cannot connect to DB...");
//     }
    
// })

// Import the database adapter functions from the db


/**
 * Set up a GET request for /reports
 * 
 * - it should use an async function
 * - it should await a call to getOpenReports
 * - on success, it should send back an object like { reports: theReports }
 * - on caught error, call next(error)
 */


/**
 * Set up a POST request for /reports
 * 
 * - it should use an async function
 * - it should await a call to createReport, passing in the fields from req.body
 * - on success, it should send back the object returned by createReport
 * - on caught error, call next(error)
 */



/**
 * Set up a DELETE request for /reports/:reportId
 * 
 * - it should use an async function
 * - it should await a call to closeReport, passing in the reportId from req.params
 *   and the password from req.body
 * - on success, it should send back the object returned by closeReport
 * - on caught error, call next(error)
 */



/**
 * Set up a POST request for /reports/:reportId/comments
 * 
 * - it should use an async function
 * - it should await a call to createReportComment, passing in the reportId and
 *   the fields from req.body
 * - on success, it should send back the object returned by createReportComment
 * - on caught error, call next(error)
 */



// Export the apiRouter
