const express = require("express")
const app = express()
const cors = require('cors');
const port = 3000
app.use(express.json())
app.use(cors());
const { Kafka } = require("kafkajs")

const kafka = new Kafka({
  clientId: "server-app",
  brokers: ["kafka:9092"],
})

const producer = kafka.producer()

app.get("/", async (req, res) => {
  try {
    await producer.connect();
    await producer.send({
      topic: "user-location-updates",
      messages: [{ value: "Hello SD class (request)!" + Date.now() }],
    });
    await producer.disconnect();
    res.send("Hello World!");
  } catch (error) {
    console.error('Error in Kafka operation:', error);
    res.status(500).send('Internal Server Error');
  }
})


app.post("/movies", async (req, res) => {
  console.log("POST /movies", JSON.stringify(req.body))
  try {
    await producer.connect();
    await producer.send({
      topic: "movies",
      messages: [{ value: JSON.stringify(req.body)}],
    });
    await producer.disconnect();
    res.send("peliculon");
  } catch (error) {
    console.error('Error in Kafka operation:', error);
    res.status(500).send('Internal Server Error');
  }
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})