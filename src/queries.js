module.exports = {
  createUserTable: `
      CREATE TABLE IF NOT EXISTS userDb (
        id UUID PRIMARY KEY
      );`,

  createLanguageTable: `
      CREATE TABLE IF NOT EXISTS languageDb (
        id UUID PRIMARY KEY,
        extension VARCHAR(10),
        name VARCHAR(50)
      );`,

  createResourceTable: `
      CREATE TABLE IF NOT EXISTS resourceDb (
        id UUID PRIMARY KEY,
        cpuTimeLimit VARCHAR(50),
        memoryLimit VARCHAR(50),
        exeLimit INT
      );`,

  createSubmissionTable: `
      CREATE TABLE IF NOT EXISTS submissionDb (
        id UUID PRIMARY KEY,
        userId UUID REFERENCES userDb(id) ON DELETE CASCADE,
        codeFilePath VARCHAR(255),
        inputFilePath VARCHAR(255),
        languageID UUID REFERENCES languageDb(id) ON DELETE SET NULL,
        limitId UUID REFERENCES resourceDb(id) ON DELETE SET NULL,
        submissionTime TIMESTAMP
      );`,

  createStatusTable: `
      CREATE TABLE IF NOT EXISTS statusDb (
        id UUID PRIMARY KEY,
        subId UUID REFERENCES submissionDb(id) ON DELETE CASCADE,
        status ENUM('submit', 'running', 'error'),
        completionTime TIMESTAMP,
        burstTime INT
      );`,

  // Insert data into submission table
  insertSubmission: `
      INSERT INTO submissionDb (
        id, userId, codeFilePath, inputFilePath, languageID, limitId, submissionTime
      ) VALUES ($1, $2, $3, $4, $5, $6, $7);`,
};
