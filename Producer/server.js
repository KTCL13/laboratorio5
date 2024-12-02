const express = require("express")
const app = express()
const port = 3000

const { Kafka } = require("kafkajs")

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:29092"],
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


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})