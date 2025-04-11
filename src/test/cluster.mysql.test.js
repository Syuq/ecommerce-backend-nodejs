const cluster = require('cluster');
const os = require('os');
const mysql = require('mysql2');

const numCPUs = os.cpus().length; // Number of workers
const batchSize = 100000;
const totalSize = 10_000_000;
const poolConfig = {
  host: 'localhost',
  port: 8811,
  user: 'root',
  password: 'tipjs',
  database: 'test'
};

if (cluster.isMaster) {
  console.time(':::::::::::::TIMER:::::::::::::');
  console.log(`Master ${process.pid} is running`);

  const chunkSize = Math.floor(totalSize / numCPUs);
  let workersDone = 0;
  // :::::::::::::TIMER:::::::::::::: 1:30.639 (m:ss.mmm)

  for (let i = 0; i < numCPUs; i++) {
    const startId = i * chunkSize + 1;
    const endId = i === numCPUs - 1 ? totalSize : (i + 1) * chunkSize;

    const worker = cluster.fork({
      START_ID: startId,
      END_ID: endId
    });

    worker.on('message', (msg) => {
      if (msg === 'done') {
        workersDone++;
        if (workersDone === numCPUs) {
          console.timeEnd(':::::::::::::TIMER:::::::::::::');
        }
      }
    });
  }
} else {
  const startId = parseInt(process.env.START_ID, 10);
  const endId = parseInt(process.env.END_ID, 10);

  const pool = mysql.createPool(poolConfig);
  let currentId = startId;

  const insertBatch = async () => {
    const values = [];
    for (let i = 0; i < batchSize && currentId <= endId; i++) {
      const name = `name- ${currentId}`;
      const age = currentId;
      const address = `address - ${currentId}`;
      values.push([currentId, name, age, address]);
      currentId++;
    }

    if (!values.length) {
      pool.end(() => {
        process.send('done');
        process.exit(0);
      });
      return;
    }

    const sql = `INSERT INTO test_table (id, name, age, address) VALUES ?`;

    pool.query(sql, [values], async function (err, results) {
      if (err) {
        console.error('Insert error:', err);
        process.exit(1);
      }

      console.log(`Worker ${process.pid}: Inserted ${results.affectedRows} records`);
      await insertBatch();
    });
  };

  insertBatch().catch(console.error);
}
