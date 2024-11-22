const express = require("express");
const cors = require("cors");
const routeChat = require("./routes/chatRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Configuración dinámica de CORS
app.use(
  cors((req, callback) => {
    const allowedOrigins = ["http://localhost:3000"]; // Puedes añadir más dominios permitidos aquí
    const origin = req.header("Origin");

    if (allowedOrigins.includes(origin)) {
      callback(null, { origin: true }); // Permitir el origen
    } else {
      callback(null, { origin: false }); // Denegar el origen
    }
  }),
);

// Middleware para parsear JSON
app.use(express.json());

// Rutas
app.use("/api", routeChat);

app.get("/", (req, res) => {
  res.send("¡Hola, Express!");
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
});
