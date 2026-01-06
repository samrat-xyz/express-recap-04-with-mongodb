const express = require('express');
const cors = require('cors');
require('dotenv').config()

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = process.env.DB_URI
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
 
const port = process.env.PORT
const app = express()
app.use(cors());
app.use(express.json())


app.get('/',(req,res)=>{
    res.send('express recap 04 server running....')
})
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const db = client.db('UsersDB');
    const dbCollections = db.collection('users')

    app.post('/users',async(req,res)=>{
        const newUser = req.body;
        const result = await dbCollections.insertOne(newUser);
        res.send(result)
    })
    app.get('/users',async(req,res)=>{
        const cursor = await dbCollections.find().toArray();
        res.send(cursor)
    })

    app.get('/users/:id',async(req,res)=>{
        const id = req.params
        const query = await dbCollections.findOne({_id : new ObjectId(id)})
        res.send(query)
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port)
