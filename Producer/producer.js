const { Kafka } = require("kafkajs")

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:29092"],
})

const producer = kafka.producer()

const runProducer = async () => {
  await producer.connect()
  await producer.send({
    topic: "user-location-updates",
    messages: [
      { value: "Hello SD class!" + Date.now() },
    ],
  })
  await producer.disconnect()
}

runProducer()
  .then(() => {
    console.log('Producer is running...');
  })
  .catch((error) => {
    console.error('Failed to run kafka producer', error);
  });