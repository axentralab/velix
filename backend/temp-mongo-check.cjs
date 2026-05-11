const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://veloura_db_user:zC4jLyJmTNmDLIz6@cluster0.qzq2e7r.mongodb.net/?appName=Cluster0';
const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000 });
(async () => {
  try {
    await client.connect();
    await client.db('admin').command({ ping: 1 });
    console.log('MONGO CONNECTED');
  } catch (err) {
    console.error('MONGO ERROR', err.message);
  } finally {
    await client.close();
  }
})();
