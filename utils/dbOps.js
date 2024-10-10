const pool = require("../config/db");
const queries = require("../src/queries");

const createTables = async () => {
  try {
    await pool.query(queries.createSubmissionTableDummy);
    console.log("All tables created successfully.");
    return 1;
  } catch (error) {
    console.error("Error creating tables:", error);
    return 0;
  }
};

const addSubmission = async (submission) => {
  const { id, codeFilePath } = submission;
  const values = [id, codeFilePath];

  try {
    await pool.query(queries.insertSubmissionDummy, values);
    console.log("Submission added successfully.");
    return 1;
  } catch (error) {
    console.error("Error adding submission:", error);
    return 0;
  }
};

// const createTables = async () => {
//   try {
//     await pool.query(queries.createUserTable);
//     await pool.query(queries.createLanguageTable);
//     await pool.query(queries.createResourceTable);
//     await pool.query(queries.createSubmissionTable);
//     await pool.query(queries.createStatusTable);
//     console.log("All tables created successfully.");
//   } catch (error) {
//     console.error("Error creating tables:", error);
//   }
// };

// const addSubmission = async (submission) => {
//   const {
//     id,
//     userId,
//     codeFilePath,
//     inputFilePath,
//     languageID,
//     limitId,
//     submissionTime,
//   } = submission;
//   const values = [
//     id,
//     userId,
//     codeFilePath,
//     inputFilePath,
//     languageID,
//     limitId,
//     submissionTime,
//   ];

//   try {
//     await pool.query(queries.insertSubmission, values);
//     console.log("Submission added successfully.");
//   } catch (error) {
//     console.error("Error adding submission:", error);
//   }
// };

module.exports = { createTables, addSubmission };
