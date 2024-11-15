const { Client } = require("cassandra-driver");

const client = new Client({
  contactPoints: ["192.168.0.75"], 
  localDataCenter: "datacenter1", 
  keyspace: "chat_system_db", 
});

client
  .connect()
  .then(() => console.log("Conectado a Cassandra en la red local"))
  .catch((err) => console.error("Error al conectar a Cassandra", err));

module.exports = client;
