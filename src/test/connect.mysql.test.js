const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'tipjs',
  password: 'tipjs123456',
  database: 'shopDEV'
});

const batchSize = 100000;
const totalSize = 10_000_000;

let currentId = 1;
console.time(':::::::::::::TIMER:::::::::::::');

const insertBatch = async () => {
  const values = [];
  for (let i = 0; i < batchSize && currentId <= totalSize; i++) {
    const name = `name- ${currentId}`;
    // const age = Math.floor(Math.random() * 100);
    const age = currentId;
    const address = `address - ${currentId}`;
    values.push([currentId, name, age, address]);
    currentId++;
  }

  if (!values.length) {
    console.timeEnd(':::::::::::::TIMER:::::::::::::');
    pool.end((err) => {
      if (err) {
        console.error('Error closing pool:', err);
      } else {
        console.log('Pool closed');
      }
    });
    return;
  }
  const sql = `INSERT INTO test_table (id, name, age, address) VALUES ?`;

  pool.query(sql, [values], async function (err, results) {
    if (err) throw err;

    console.log(`Inserted ${results.affectedRows}, records`);

    await insertBatch();
    // pool.end((err) => {
    //   if (err) throw err;
    //   console.error('Error closing pool:');
    // });
  });
};

insertBatch().catch(console.err);
