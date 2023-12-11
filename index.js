const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
dotenv.config({ path: './.env' });

const app = express()

app.use(cors())
app.use(express.json())

const port = 3000

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.irwbbs1.mongodb.net/?retryWrites=true&w=majority`

app.get('/', (req,res)=>{
  res.send('backend is running')
})


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    //DB
    const database = await client.db('backend')
    const videos = await database.collection('videos')

    //get All Videos data
    app.get('/videos',async (req,res)=>{
        
        const data = await videos.find().toArray()

        res.send(data)
    })

    //update view count increment by by id 
    app.patch('/incrementView',async(req,res)=>{
      const {id, count} = req.body
  
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: false}

      const updateDoc = {
        $set:{
          viewCount: count + 1,
        }
      }

      const result = await videos.updateOne(filter, updateDoc, options)
      res.send(result)
    })

} finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port,()=>{
    console.log(`app listening from ${port}`)
})