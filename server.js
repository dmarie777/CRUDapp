console.log('may node be with you');
const express = require ('express')
// const MongoClient = require('mongodb').MongoClient
const bodyParser = require('body-parser')
const app = express()
//let uri = 'mongodb+srv://yoda:%2Fstarwars%2F@<clustername>-rmp3c.mongodb.net/test?retryWrites=true&w=majority';

const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://yoda:%2Fstarwars%2F@cluster0.5jiyiak.mongodb.net/?retryWrites=true&w=majority";

//from tutorial
MongoClient.connect(uri, {useUnifiedTopology: true })
  .then(client => {
    console.log('connected to Database')
    const db = client.db('stars-wars-quote')
    const quotesCollection = db.collection('quotes')
    
    app.set('view engine', 'ejs')
    
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(express.static('public'))
    app.use(bodyParser.json())

    app.get( '/', (req , res) => {
      quotesCollection.find().toArray()
        .then(results => {
          res.render('index.ejs', { quotes: results })
        }) .catch(error => console.error(error))
      // res.sendFile(__dirname + '/index.html')
    })

    app.post('/quotes', (req, res) => {
      quotesCollection.insertOne(req.body)
        .then( result => {
          //console.log(result);
          //with the following code once i write one quote it restarts the entries to let the user write another quote, otherwise 
          res.redirect('/')
        })
        .catch(error => console.error(error))
    })
    
    app.put('/quotes', (req,res) => {
      quotesCollection.findOneAndUpdate(
        {name: 'Yoda'},
        {
          $set: {
            name: req.body.name,
            quote: req.body.quote
          }
        },
        {
          upsert: true
        }
      )
      .then(result => {
        res.json('Success')
      })
      .catch(error => console.error(error))
    })

    app.delete('/quotes', (req, res) => {
      quotesCollection
                .deleteOne({ name: req.body.name })
                .then(result => {
                  if (result.deletedCount === 0) {
                    return res.json('No quote to delete')
                  }
                  res.json(`Deleted Darth Vader's quote`)
                })
                .catch(error => console.error(error))
    })



    app.listen(3000, function() {
      console.log('listening on 3000');
    })
  })
  .catch(error => console.error(error))


//All your handlers here...


// //endpint: requested endpoint-- comes after our domain name

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });
// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("star-wars-quotes").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");

//     //Conect to ollection
//     await client.db("star-wars-quotes").collection('quotes');

//     // const db = client.db('star-wars-quotes');
//     // const quotesCollection = db.collection('quotes')
//     // console.log(quotesCollection);


//     app.use(express.urlencoded({ extended: true})) 
//     app.get('/', (req, res) => {
//       res.sendFile(__dirname + '/index.html')
//     })
//     app.post('/quotes' , (req, res) => {
//       quotesCollection
//         .insertOne(req.body)
//         .then(result => {
//           console.log(result);
//         })
//         .catch( error => console.error(error) )
//     })
//     app.listen(3000, function() {
//       console.log('listening on 3000');
//     })

//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);

