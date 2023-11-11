const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.port || 5000;

// middlewares
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello module56 is running')
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fikwith.mongodb.net/?retryWrites=true&w=majority`;

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

    const database = client.db("module56CoffeeDB");
    const coffeeCollection56 = database.collection("coffees");

    const userCollection = client.db('56RegisterUserDB').collection('56users');

    // Users related Api
    app.post('/users', async(req, res)=>{
        const user = req.body;
        console.log(user);
        const result = await userCollection.insertOne(user);
        res.send(result)

    })

    app.delete('/users/:id', async(req, res)=>{
        const id = req.params.id;
        const query ={_id : new ObjectId(id)}
        const result = await userCollection.deleteOne(query);
        res.send(result)
    })

    app.get('/users', async(req,res)=>{
        const cursor = userCollection.find();
        const users = await cursor.toArray();
        res.send(users)
    })

    app.patch('/users', async(req, res)=>{
        const user = req.body;
        const filter ={email: user.email};
        // const options = { upsert: true };
        const updateDoc = {
            $set: {
                lastLogged : user.lastLogged 
            },
          };
          // Update the first document that matches the filter
          const result = await userCollection.updateOne(filter, updateDoc);
          res.send(result)

    })



    // Coffee related Api
    app.post('/coffees', async(req, res)=>{
        const newCoffee = req.body;
        console.log(newCoffee);
        const result = await coffeeCollection56.insertOne(newCoffee);
        res.send(result)

    })


    app.get('/coffees', async(req, res)=>{
        const cursor = coffeeCollection56.find();
        const result = await cursor.toArray();
        res.send(result)
    })

    app.get('/coffees/:id', async(req, res)=>{
        const id = req.params.id;
        const cursor = {_id: new ObjectId(id)};
        const result = await coffeeCollection56.findOne(cursor) ;
        res.send(result)
    })

    app.delete('/coffees/:id', async(req, res)=>{
        const id = req.params.id;
        const query ={_id : new ObjectId(id)}
        const result = await coffeeCollection56.deleteOne(query);
        res.send(result)
    })

    app.put('/coffees/:id', async(req, res)=>{
        const id = req.params.id;
        const coffee = req.body;
        const filter ={_id: new ObjectId(id)};
        const options = { upsert: true };
        const updateDoc = {
          $set: {
            name : coffee.name ,
            chef : coffee.chef ,
            supplier : coffee.supplier ,
            taste : coffee.taste ,
            category : coffee.category ,
            details : coffee.details,
            photo : coffee.photo ,

          },
        };
        const result = await coffeeCollection56.updateOne(filter, updateDoc, options);
        res.send(result)
        
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


app.listen(port, () => {
  console.log(`Hello module56 is running on port ${port}`)
})