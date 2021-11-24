const express = require("express");
const { MongoClient, FindCursor } = require("mongodb");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

// MiddleWare
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uym3z.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("Volunteer_Service");
    const serviceCollection = database.collection("services");
    const userInfoCollection = database.collection("userInfo");
    //   GET API OF EVENTS
    app.get("/services", async (req, res) => {
      const cursor = serviceCollection.find({});
      const services = await cursor.toArray();
      res.json(services);
    });
    // GET API FOR USER INFO
    app.get("/userInfo", async (req, res) => {
      const cursor = userInfoCollection.find({});
      const usersInfo = await cursor.toArray();
      res.json(usersInfo);
    });
    //  POST API
    app.post("/userInfo", async (req, res) => {
      const data = req.body;
      const result = await userInfoCollection.insertOne(data);
      res.json(result);
    });
    // Delete API
    app.delete("/userInfo/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { key: { ObjectId: id } };
      console.log(query);
      const result = await userInfoCollection.deleteOne(query);
      res.json(result);
    });
  } finally {
    // client.close()
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server Running");
});

app.listen(port, () => {
  console.log("Listening to port:", port);
});
