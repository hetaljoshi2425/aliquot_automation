const sql = require('mssql/msnodesqlv8');

const configEsr = {
  user: process.env.esrDbUser,
  password: process.env.ESR_DB_PASSWORD,
  server: process.env.esrDbHOST,
  database: 'your_database_name',
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};

async function queryDB(query) {
  try {
    let pool = await sql.connect(configEsr);
    let result = await pool.request().query(query);
    await pool.close();
    return result.recordset;
  } catch (err) {
    console.error('DB Error:', err);
    throw err;
  }
}

module.exports = { queryDB };
