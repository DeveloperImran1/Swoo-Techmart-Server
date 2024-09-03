require('dotenv').config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;



// middleware
app.use(cors({
  origin: ['https://wom-e-comerce-site.netlify.app'],
  credentials: true
}));
app.use(express.json());

// 

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mr9mnat.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const womProductsCollection = client.db("Bkash").collection("wom-ecomerce");


    // get all products 
    app.get('/products', async (req, res) => {
      const data = await womProductsCollection.find().toArray();
      res.send(data)
    })

    // add a product in db 
    app.post('/product', async (req, res) => {
      const product = req.body;
      console.log(product)
      const result = await womProductsCollection.insertOne(product)
      res.send(result)
    })

    // delete an product 
    app.delete("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const data = await womProductsCollection.deleteOne(query)
      res.send(data)
    })

    // update now product data 
    app.patch('/product/:id', async(req, res)=> {
      const id = req.params.id;
      const updateInfo = req.body;
     const query = {_id: new ObjectId(id)}
     const updated = {
      $set: {
        title: updateInfo?.title,
        price: updateInfo?.price,
        totalAvailable: updateInfo?.totalAvailable,
        description: updateInfo?.description,
        category: updateInfo?.category,
        color: updateInfo?.color,
        offer: updateInfo?.offer,
      }
     }
     const result = await womProductsCollection.updateOne(query, updated)
     res.send(result)
    })

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

  }
}
run().catch(console.dir);


app.get("/", async (req, res) => {
  res.send("Server is running in 5000 port")
})

app.listen(port, () => {
  console.log("server is running in ", port)
})