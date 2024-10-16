//after testing do convert ID from int to uuid
const createQueries = {
  createUserTable: `
  CREATE TABLE IF NOT EXISTS userDb (
    id INT PRIMARY KEY
  );`,

  createLanguageTable: `
  CREATE TABLE IF NOT EXISTS languageDb (
    id INT PRIMARY KEY,
    extension VARCHAR(10),
    name VARCHAR(50)
  );`,

  createResourceTable: `
  CREATE TABLE IF NOT EXISTS resourceDb (
    id INT PRIMARY KEY,
    cpuTimeLimit VARCHAR(50),
    memoryLimit VARCHAR(50),
    exeLimit INT
  );`,

  //temp database to test the logic of submission
  createSubmissionTableDummy: ` 
  CREATE TABLE IF NOT EXISTS testDb (
    id SERIAL PRIMARY KEY,
    codeFilePath VARCHAR(255)
  );`,

  createDummyExecutionTable: `
  CREATE TABLE IF NOT EXISTS executionDb (
    id SERIAL PRIMARY KEY,
    submissionId INT UNIQUE NOT NULL,
    status VARCHAR(50) CHECK (status IN ('completed', 'submitted', 'running', 'error')) DEFAULT 'submitted',
    outputFilePath VARCHAR(255)
  );`,
  createSubmissionTable: `
  CREATE TABLE IF NOT EXISTS submissionDb (
    id INT PRIMARY KEY,
    userId INT REFERENCES userDb(id) ON DELETE CASCADE,
    codeFilePath VARCHAR(255),
    inputFilePath VARCHAR(255),
    languageID INT REFERENCES languageDb(id) ON DELETE SET NULL,
    limitId INT REFERENCES resourceDb(id) ON DELETE SET NULL,
    submissionTime TIMESTAMP
  );`,

  createStatusTable: `
  CREATE TABLE IF NOT EXISTS statusDb (
    id INT PRIMARY KEY,
    subId INT REFERENCES submissionDb(id) ON DELETE CASCADE,
    status ENUM('submit', 'running', 'error'),
    completionTime TIMESTAMP,
    burstTime INT
  );`,
};

const operationQueries = {
  // Insert data into submission table
  insertSubmission: `
      INSERT INTO submissionDb (
        id, userId, codeFilePath, inputFilePath, languageID, limitId, submissionTime
      ) VALUES ($1, $2, $3, $4, $5, $6, $7);`,

  insertSubmissionDummy: `INSERT INTO testDb (codeFilePath) VALUES ($1) RETURNING id;`,
  insertDummyExecution: `INSERT INTO executionDb (submissionId) VALUES ($1) RETURNING id;`,
  updateExecutionStatus: `UPDATE executionDb SET status = $1 WHERE submissionId = $2;`,
  setOutputFilePath: `UPDATE executionDb SET outputFilePath = $1 WHERE submissionId = $2;`,
  getOutputFilePath: `SELECT outputFilePath FROM executionDb WHERE submissionId = $1;`,
  getStatus: `SELECT status FROM executionDb WHERE submissionId = $1;`,
};

module.exports = { createQueries, operationQueries };
