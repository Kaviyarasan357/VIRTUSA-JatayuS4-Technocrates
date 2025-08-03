const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://Kavin_admin:Kavi%40123@mentalhealth-cluster.gn8wvsl.mongodb.net/?retryWrites=true&w=majority&appName=mentalhealth-cluster';

const dbName = 'test';            

async function seedData() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('negativeLogs');

    const logs = [
      {
        title: "Inappropriate Site",
        url: "http://badwebsite.com",
        score: 0.92,
        timestamp: new Date()
      },
      {
        title: "Explicit Video",
        url: "http://explicitcontent.com/video",
        score: 0.95,
        timestamp: new Date()
      },
      {
        title: "Disturbing Forum",
        url: "http://disturbingforum.com",
        score: 0.88,
        timestamp: new Date()
      }
    ];

    const result = await collection.insertMany(logs);
    console.log(`✅ Inserted ${result.insertedCount} logs.`);
  } catch (err) {
    console.error('❌ Error inserting logs:', err);
  } finally {
    await client.close();
  }
}

seedData();
