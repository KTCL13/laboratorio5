const { Kafka } = require("kafkajs")

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:29092"],
})

const consumer = kafka.consumer({ groupId: 'test-group' })

const runConsumer = async () => {

  await consumer.connect()
  await consumer.subscribe({ topic: 'user-location-updates', fromBeginning: true })

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log("test")
      console.log({ value: message.value.toString()})
    },
  })
}

runConsumer()
  .then(() => {
    console.log('Producer is running...');
  })
  .catch((error) => {
    console.error('Failed to run kafka consumer', error);
  });