const { Kafka } = require("kafkajs");
const nodemailer = require("nodemailer");

const kafka = new Kafka({
  clientId: "email-service",
  brokers: ["kafka:9092"],
});

const consumer = kafka.consumer({ groupId: "email-group" });

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "pruebaspara991@gmail.com",
    pass: "parapruebas_619",
  },
});

async function sendEmail(to, subject, text) {
  try {
    await transporter.sendMail({
      from: '"Movie Service" <pruebaspara991@gmail.com>',
      to,
      subject,
      text,
    });
    console.log(`Correo enviado a ${to}`);
  } catch (error) {
    console.error("Error al enviar el correo:", error);
  }
}

const runConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "movies", fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const content = JSON.parse(message.value.toString());

      const email = content.user.parentEmail;
      const age = parseInt(content.user.age, 10);

      console.log(`Procesando mensaje: ${email}, ${age}`);

      if (age < 18) {
        const subject = "Acceso restringido por edad";
        const body = `Hola, hemos recibido tus datos, pero no puedes acceder al contenido debido a que tienes ${age} años.`;
        await sendEmail(email, subject, body);
      }
    },
  });
};

runConsumer()
  .then(() => console.log("Servicio de correo iniciado..."))
  .catch((error) => console.error("Error al iniciar el consumidor Kafka:", error));
