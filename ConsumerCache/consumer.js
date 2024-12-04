const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { Kafka } = require("kafkajs")
const redis = require('redis');


const app = express();
const redisClient = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: 6379,
  },
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"],
  },
});
const PORT = 7700;


app.use(express())

io.on("connection", async (socket) => {
  console.log("Cliente conectado");

  socket.emit("updateTopShows",await redisData());


  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});


server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});


const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["kafka:9092"],
})

const consumer = kafka.consumer({ groupId: 'cache-group' })

const runConsumer = async () => {

  await consumer.connect()
  await consumer.subscribe({ topic: 'movies', fromBeginning: true })

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log("test")
      console.log({ value: message.value.toString()})
      await saveMovie(message.value)
   },
  })
}

runConsumer()
  .then(() => {
    console.log('Consumer is running...');
  })
  .catch((error) => {
    console.error('Failed to run kafka consumer', error);
  });



async function getRedisClient() {
  if (!redisClient.isOpen) {
    await redisClient.connect(); // Asegúrate de que la conexión esté abierta
  }
  return redisClient; 
}

async function saveMovie(message) {
  try {
    const client = await getRedisClient(); 
    const messageString = message.toString();
    const parsedMessage = JSON.parse(messageString);
    const cacheKey = `movies:${parsedMessage.movie.toLowerCase()}`;
    const countKey = `${cacheKey}:count`;
    
    const cachedMovies = await client.get(cacheKey);
  
    
    if (cachedMovies) {
      console.log(cachedMovies)
      console.log('Resultado obtenido de Redis');
      await client.incr(countKey);
      io.emit("updateTopShows", await redisData());

    } else {
        await limitRedisCache(18); 
        console.log("si se puede guardar")
        await client.set(countKey, 1);
        console.log("listo el contador xd")
        movieImage=parsedMessage.movieImage
        await redisClient.set(cacheKey, movieImage);
        console.log("guardao")
        io.emit("updateTopShows", await redisData());

    }
  } catch (error) {
    console.error('Error al guardar la película en Redis:', error);
  }
}


async function resdiskeys(){
  console.log(await redisClient.keys('movies:*'));
  }


  async function redisData() {
    try {
      await getRedisClient();
      const keys = await redisClient.keys('movies:*');
      const movieKeys = keys.filter(key => !key.endsWith(':count'));
      const result = []  
  
      for (let key of movieKeys) {
        const value = await redisClient.get(key);
        const visits = await redisClient.get(key + ":count");
        const movieName = key.replace('movies:', '');
  
        result.push({ movie: movieName, image: value, visits: parseInt(visits, 10) });
      }
  

      result.sort((a, b) => b.visits - a.visits);
  
      return result; 
    } catch (err) {
      console.error('Error obteniendo las claves:', err);
      return {}; 
    }
  }
  
  
async function limitRedisCache(maxKeys) {
  console.log("testabdi limites")
  const keys = await redisClient.keys('movies:*');
  if (keys.length > maxKeys) {
    const lessVisitedKey = await getKeyWithMinCount()
    await redisClient.del(lessVisitedKey)
    await redisClient.del(`${lessVisitedKey}:count`);
  }
}


async function getKeyWithMinCount() {
  console.log("se supero el limite")
  const countKeys = await redisClient.keys('movies:*:count');
  
  console.log(JSON.stringify(countKeys))

  let minKey = null;
  let minCount = Infinity;

  for (const key of countKeys) {
    const count = await redisClient.get(key);
    const countValue = parseInt(count, 10); 
    if (countValue < minCount) {
      minCount = countValue;
      minKey = key.replace(':count', '');
    }
  }
  console.log(minKey)
  return minKey;
}




  
  
