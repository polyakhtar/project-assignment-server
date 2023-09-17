const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB URI with credentials
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mjqzqbo.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1, // Set your desired API version
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    console.log("Connected to MongoDB!");
    const projectCollection = client.db('Projects').collection('product');
    app.post('/projects',async(req,res)=>{
       const project=req.body;
       const result=await projectCollection.insertOne(project);
       res.send(result)
    })
    app.get('/projects',async(req,res)=>{
        const query={};
        const sort = { _id: -1 };
        const result=await projectCollection.find(query).sort(sort).toArray();
        res.send(result)
    })

    // Send a ping to confirm a successful connection (optional)
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

// Start the connection
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('projects API running');
});

app.listen(port, () => {
  console.log(`projects server is running on port ${port}`);
});
