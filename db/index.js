const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost:5432/phenomena-dev')


// Require the Client constructor from the pg package

// Create a constant, CONNECTION_STRING, from either process.env.DATABASE_URL or postgres://localhost:5432/phenomena-dev

// Create the client using new Client(CONNECTION_STRING)
// Do not connect to the client in this file!

/**
 * Report Related Methods
 */

/**
 * You should select all reports which are open. 
 *  
 * Additionally you should fetch all comments for these
 * reports, and add them to the report objects with a new field, comments.
 * 
 * Lastly, remove the password field from every report before returning them all.
 */
async function getOpenReports() {
  try {
    const { rows: reports } = await client.query(`

    SELECT * FROM reports WHERE "isOpen"=true;`); 

    for (let i = 0; i < reports.length; i++){
      const report = reports[i];

      const { rows: comments } = await client.query(`

      SELECT * FROM comments where "reportId"=$1

      `, [report.id]);

      report.comments = [];
      for(let j = 0; j < comments.length; j++){
        report.comments.push(comments[j])
      }
      
      //expiration date
      const expiration = Date.parse(report.expirationDate);
      const currentDate = Date.now();
      report.isExpired = expiration < currentDate;
      
    }
     
    // first load all of the reports which are open
    

    // then load the comments only for those reports, using a
    // WHERE "reportId" IN () clause

    
    // then, build two new properties on each report:
    // .comments for the comments which go with it
    //    it should be an array, even if there are none
    // .isExpired if the expiration date is before now
    //    you can use Date.parse(report.expirationDate) < new Date()
    // also, remove the password from all reports


    // finally, return the reports
  
  return reports;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

/**
 * You should use the reportFields parameter (which is
 * an object with properties: title, location, description, password)
 * to insert a new row into the reports table.
 * 
 * On success, you should return the new report object,
 * and on failure you should throw the error up the stack.
 * 
 * Make sure to remove the password from the report object
 * before returning it.
 */
async function createReport(reportFields) {
  // Get all of the fields from the passed in object
  const { title, location, description, password } = reportFields;

  try {
    const SQL = `
    INSERT INTO reports(title, location, description, password)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `
    const response = await client.query(SQL, [title, location, description, password]);
    const report = response.rows[0];
    //console.log(report)
    delete report.password;
    return report;

    // insert the correct fields into the reports table
    // remember to return the new row from the query
    

    // remove the password from the returned row
    

    // return the new report
    

  } catch (error) {
    throw error;
  }
}

/**
 * NOTE: This function is not for use in other files, so we use an _ to
 * remind us that it is only to be used internally.
 * (for our testing purposes, though, we WILL export it)
 * 
 * It is used in both closeReport and createReportComment, below.
 * 
 * This function should take a reportId, select the report whose 
 * id matches that report id, and return it. 
 * 
 * This should return the password since it will not eventually
 * be returned by the API, but instead used to make choices in other
 * functions.
 */
async function _getReport(reportId) {
  try {
    // SELECT the report with id equal to reportId

    const SQL = `SELECT * FROM reports WHERE id =$1`

    const response = await client.query(SQL, [reportId]);
    const report = response.rows[0];
    return report;

    // return the report
    

  } catch (error) {
    throw error;
  }
}

/**
 * You should update the report where the reportId 
 * and password match, setting isOpen to false.
 * 
 * If the report is updated this way, return an object
 * with a message of "Success".
 * 
 * If nothing is updated this way, throw an error
 */
async function closeReport(reportId, password) {
  try {
    const { rows: [reports] } = await client.query(`
    SELECT * FROM reports 
    WHERE id=$1
    `, [reportId]);
    // console.log("here's the report", reports);
    // console.log("supply password", password);

    if (!reports) {
      throw new Error ('Report does not exist with that id');
    }

    if (reports.password !== password){
      throw new Error('Password incorrect for this report, please try again');
    }
    if (!reports.isOpen){
      throw new Error('This report has already been closed');
    }
    const SQL =
      `
      UPDATE reports
      SET "isOpen"='false'
      WHERE id=$1;
      `
      const response= await client.query(SQL, [reportId]);
      const report = response.rows[0];
      return {message: "Report successfully closed!"};
  
    // First, actually grab the report with that id
   

    // If it doesn't exist, throw an error with a useful message
    
  
    // If the passwords don't match, throw an error
    

    // If it has already been closed, throw an error with a useful message
    

    // Finally, update the report if there are no failures, as above
    

    // Return a message stating that the report has been closed
    

  } catch (error) {
    throw error;
  }
}

/**
 * Comment Related Methods
 */

/**
 * If the report is not found, or is closed or expired, throw an error
 * 
 * Otherwise, create a new comment with the correct
 * reportId, and update the expirationDate of the original
 * report to CURRENT_TIMESTAMP + interval '1 day' 
 */
async function createReportComment(reportId, commentFields) {
  try {
    const { rows: [reports] } = await client.query(`
    SELECT * FROM reports
    WHERE id = $1
    `, [reportId]);
    if(!reports){
      throw new Error ('That report does not exist, no comment has been made');

    }

    const expiration = Date.parse(reports.expirationDate);
    const currentDate = Date.now();
    if(!reports.isOpen){
      throw new Error ('That report has been closed, no comment has been made');
  }
  if (expiration < currentDate){
    throw new Error ('The discussion time on this report has expired, no comment has been made');

  }

  const { rows: [comment] } = await client.query(
    `INSERT INTO comments ("reportId", content )
    VALUES ($1, $2)
    RETURNING *
    `, [reportId, commentFields.content]
  )
    console.log("looking for comment", comment);
    if(comment.content){
      return comment;
    }

  } catch (error) {
    throw error;
  }
}

// export the client and all database functions below
module.exports = {
  client,
  createReport,
  getOpenReports,
  _getReport,
  closeReport,
  createReportComment
}