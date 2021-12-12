const express=require('express');
const cors=require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId=require('mongodb').ObjectId;
const { cursorTo } = require('readline');

const app=express();
app.use(cors());
app.use(express.json());

const port=process.env.PORT || 500;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wuxif.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/',(req,res)=>{
    res.send('CRUD SERVER is running');
})

async function run(){
    try{
        await client.connect();
        const database = client.db("toursylhet");
        const eventCollection=database.collection('events');
        const orderCollection=database.collection('orders');
        const hotelCollection=database.collection('hotels');
        const restaurantCollection=database.collection('restaurants');

        //Add Events
        app.post('/events', async (req,res)=>{
            const newEvent=req.body;
            const result = await eventCollection.insertOne(newEvent);
            res.json(result);
            console.log('New Event has been inserted with id- ',result.insertedId);
        })
        //Get Events
        app.get('/events', async (req,res)=>{
            const cursor = eventCollection.find({});
            const result = await cursor.toArray();
            res.json(result);
        })
        //Get a Definite Event
        app.get('/events/:id', async (req,res)=>{
            const id=req.params.id;
            const query={_id:ObjectId(id)};
            const result = await eventCollection.findOne(query);
            res.json(result);
        })

        //Get Hotels
        app.get('/hotels', async (req,res)=>{
            const cursor = hotelCollection.find({});
            const result = await cursor.toArray();
            res.json(result);
        })
        //Get Restaurants
        app.get('/restaurants', async (req,res)=>{
            const cursor = restaurantCollection.find({});
            const result = await cursor.toArray();
            res.json(result);
        })
        //POST to orders
        app.post('/orders', async (req,res)=>{
            const newOrder=req.body;
            const result = await orderCollection.insertOne(newOrder);
            res.send(result);
        })
        //GET Orders
        app.get('/orders', async (req,res)=>{
            const cursor=orderCollection.find({});
            const result=await cursor.toArray();
            res.send(result);
        })
        //Get  definite order
        app.get('/orders/:email', async (req,res)=>{
            const queryEmail=req.params.email;
            const query={email: queryEmail};
            const cursor= orderCollection.find(query);
            const result =await cursor.toArray();
            res.send(result);
        })
        //Delete a order
        app.delete('/orders/:id',async (req,res)=>{
            const id=req.params.id;
            const query={_id:ObjectId(id)};
            const result=await orderCollection.deleteOne(query);
            res.json(result);
        })
        
        //PUT method to update status
        app.put('/orders/:id', async (req,res)=>{
            const id=req.params.id;
            const newOrder=req.body;
            const filter={_id:ObjectId(id)};
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                  email: newOrder.email,
                  name: newOrder.name,
                  phone: newOrder.phone,
                  adress: newOrder.adress,
                  img: newOrder.img,
                  title: newOrder.title,
                  desc: newOrder.desc,
                  status: newOrder.status 
                },
              };
              const result = await orderCollection.updateOne(filter, updateDoc, options);
              res.json(result);
        })

    }
    finally{

    }
}

run().catch(console.dir);

app.listen(port,()=>{
    console.log(`Server is running at http://localhost:${port}`);
})