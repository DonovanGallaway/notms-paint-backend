////////////////////////////
// Dependencies
////////////////////////////
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose') // This can be changed to './database/connection' if you make a connection.js file
const cors = require('cors')
const app = express()
const { PORT, DATABASE_URL } = process.env
console.log(DATABASE_URL)

/////////////////////////////////
// Database Connection
////////////////////////////////
// establish connection
mongoose.connect(DATABASE_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})

// Connection Events
mongoose.connection
.on("open", () => console.log("You are connected to Mongo"))
.on("close", () => console.log("You are disconnected from Mongo"))
.on("error", (error) => console.log(error))


//////////////////////////////
// Models
//////////////////////////////


const CanvasSchema = new mongoose.Schema({
    dataURL: String
})

const Canvas = mongoose.model("Canvas", CanvasSchema)



///////////////////////////////
// MiddleWare
////////////////////////////////
app.use(cors()); // to prevent cors errors, open access to all origins
app.use(morgan("dev")); // logging
app.use(express.json({limit: '25mb'}));
app.use(express.urlencoded({limit: '25mb'}));




// Routes



app.get("/", (req, res) => {
    res.send("Hello World")
})

//  INDEX ROUTE
app.get("/canvas", async (req, res) => {
    try {
      res.json(await Canvas.find({}));
    } catch (error) {
      //send error
      res.status(400).json({error});
    }
  });

  app.get('/canvas/:id', async (req,res) => {
      const id = req.params.id
      try {
          res.json(await Canvas.findById(id))
      } catch (error){
          res.status(400).json({error})
      }
  })


// CREATE ROUTE 
app.post("/canvas", async (req, res) => {
    try {
      res.json(await Canvas.create(req.body));
    } catch (error) {
      res.status(400).json({ error });
    }
  });


  // UPDATE ROUTE 
app.put("/canvas/:id", async (req, res) => {
    try {
       
        res.json(await Canvas.findByIdAndUpdate(req.params.id, req.body, {new: true}));
      } catch (error) {
        res.status(400).json({ error });
      }
})


// DELETE ROUTE 
app.delete("/canvas/:id", async (req, res) => {
    try {
   
      res.json(await Canvas.findByIdAndRemove(req.params.id));
    } catch (error) {
      //send error
      res.status(400).json(error);
    }
  });

  // Boom Button (mass delete)
  app.delete('/canvas/bigDelete/yep', async (req,res) => {
    try {
      res.json(await Canvas.deleteMany({}))
    } catch (error){
      res.status(400).json({error})
    }
  })

/////////////////////////////////
// Server Listener
/////////////////////////////////
app.listen(PORT, () => {console.log(`listening on PORT ${PORT}`)})
