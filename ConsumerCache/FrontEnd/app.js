const app = Vue.createApp({
    data() {
      return {
        topShows: [],  // Aquí se almacenan las películas más vistas
        socket: null,  // Conexión Socket.IO
      };
    },
    mounted() {
      // Conectar con el servidor Socket.IO
      this.socket = io("http://localhost:7700");
  
      // Escuchar actualizaciones del top 10 de shows
      this.socket.on("updateTopShows", (data) => {
        console.log("data recibida",data)
        console.log(JSON.stringify(data))
        this.topShows = data;
      });
    }
  });
  
  app.mount("#app");
  