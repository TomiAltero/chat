const express = require("express");
const cors = require("cors");
const routeChat = require("./routes/chatRoutes");


const app = express();
const PORT = process.env.PORT || 5000;

// Configuración de CORS
app.use(
  cors({
    origin: "http://192.168.100.66:3000", 
    methods: "GET,POST", 
    allowedHeaders: "Content-Type", 
  }),
);

// Middleware para parsear JSON
app.use(express.json());``

// Rutas
app.use("/api", routeChat);


app.get("/", (req, res) => {
  res.send("¡Hola, Express!");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
});
