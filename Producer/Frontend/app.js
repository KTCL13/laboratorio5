const serverAddres="192.168.1.5:3000"

const app = Vue.createApp({
    data() {
      return {
        movies: [
            { id: 1, title: "Película 1", image: "https://occ-0-1462-116.1.nflxso.net/dnm/api/v6/mAcAr9TxZIVbINe88xb3Teg5_OA/AAAABVBOqmUFTVlFY96xR4fOJRM3QOjOHhNkIIbe-Bb6l8eQ4CmzgTFR2cd6SeeTh24NxsgJ_CyZM_YsaYjjQ7rRnhcDhGrhmQcW-fOBXKV9KtmVCiWISTjmJl25c55MZZyfGg6d0w.webp?r=852200x300" },
            { id: 2, title: "Película 2", image: "https://occ-0-1462-116.1.nflxso.net/dnm/api/v6/mAcAr9TxZIVbINe88xb3Teg5_OA/AAAABUljwa8I4sbO0hq-pjROu9yLBwB9cTZS_j8F6z2660I51MgT8REgj-zWxGieyK-_KWVAaySzq44P2MFqRkssHKSkwct-CBAvN8uf.webp?r=767200x300" },
            { id: 3, title: "Película 3", image: "https://occ-0-1462-116.1.nflxso.net/dnm/api/v6/mAcAr9TxZIVbINe88xb3Teg5_OA/AAAABRPTD-J8aw8YXWkB6jCZTFfBF0cmkUkYSCp_B7X72C_TyOooIymI1dgPjXbAxPcRnhmnWaCtd7rCV2qxx8sGQJxo00H2YC90osVKqsK3vcviPxY0XhZD2itxeYDp-ZJXXtd0zg.webp?r=f01/200x300" },
            { id: 4, title: "Película 4", image: "https://occ-0-1462-116.1.nflxso.net/dnm/api/v6/mAcAr9TxZIVbINe88xb3Teg5_OA/AAAABQSfyBKISyqeuHKnKTxHP0ul66HCHFsDqgRxWh8D-X0gr3dq5rbmuf8ez1KucDY3CeKea8jcOWFBZ3n2M3mYHJmM9aOKWD02vw4X.webp?r=50b" },
            { id: 5, title: "Película 5", image: "https://occ-0-1462-116.1.nflxso.net/dnm/api/v6/mAcAr9TxZIVbINe88xb3Teg5_OA/AAAABe4DksfMI45LmwzkOiTSiOCnt59sOAZRCBJUf2vpjr8BGsjlyR2fpOrBggFBFsp2u32sa9aRMS4Y1D52afAvD6BMn6S0RszIlmTb.webp?r=e61" },
            { id: 6, title: "Película 6", image: "https://lumiere-a.akamaihd.net/v1/images/image_4f447b1d.jpeg?region=0,0,540,810&width=480" },
            { id: 7, title: "Película 7", image: "https://http2.mlstatic.com/D_NQ_NP_711226-MLM46712707580_072021-O.webp" },
            { id: 8, title: "Película 8", image: "https://static.wikia.nocookie.net/spiderman/images/f/f9/The_Amazing_Spider_Man_Poster.png/revision/latest?cb=20131213215215&path-prefix=es" },
            { id: 9, title: "Película 9", image: "https://es.web.img3.acsta.net/pictures/14/10/02/11/07/341344.jpg" },
            { id: 10, title: "Película 10", image: "https://es.web.img3.acsta.net/c_310_420/pictures/17/06/15/11/08/353746.jpg" },
          ],
        selectedMovie: null,
        form: {
          name: "",
          age: "",
          parentEmail: "",
        },
      };
    },
    methods: {
      selectMovie(movie) {
        this.selectedMovie = movie;
      },
      closeModal() {
        this.selectedMovie = null;
        this.form = { name: "", age: "", parentEmail: "" };
      },
      async submitForm() {
        const eventData = {
          movie: this.selectedMovie.title,
          movieImage: this.selectedMovie.image,
          user: {
            name: this.form.name,
            age: this.form.age,
            parentEmail: this.form.age < 18 ? this.form.parentEmail : null,
          },
          timestamp: new Date().toISOString(),
        };
      
        try {
          const response = await fetch("http://"+serverAddres+"/movies", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(eventData),
          });
      
          if (!response.ok) {
            throw new Error(`Error al enviar evento: ${response.statusText}`);
          }
      
          alert("Evento enviado con éxito");
        } catch (error) {
          console.error("Error al enviar el evento:", error);
          alert("Ocurrió un error al enviar el evento");
        } finally {
          this.closeModal();
        }
      },
    },
  });
  
  app.mount("#app");
  
