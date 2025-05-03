const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.port || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xihi8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
      const MenuCollection = client.db('bistroDb').collection('menu');
      const ReviewCollection = client.db('bistroDb').collection('reviews')
      const CartCollection = client.db('bistroDb').collection('carts')
    
      app.get('/menu', async (req, res) => {
        const result = await MenuCollection.find().toArray()
        res.send(result)
    })
    app.get('/review', async (req, res) => {
      const result = await ReviewCollection.find().toArray()
      res.send(result)
  })
  app.post('/carts', async (req, res) => {
      const cartInfo = req.body;
      const result = await CartCollection.insertOne(cartInfo);
      res.send(result);
  })
  app.get('/carts', async (req, res) => {
    const email = req.query.email;
    const query = {
        userEmail: email
    }
    const result = await CartCollection.find(query).toArray()
    res.send(result)
})
app.delete('/carts/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) }
    const result = await CartCollection.deleteOne(query)
    res.send(result)
})
      await client.connect();
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      // Ensures that the client will close when you finish/error
     // await client.close();
    }
  }
  run().catch(console.dir);





app.get('/',(req,res)=> {
    res.send('boSS is cooking')
})


app.listen(port,() => {
    console.log(`server on port: ${port}`)
})