const { v4: uuidv4 } = require("uuid");
const client = require("../db");

exports.getUsers = async (req, res) => {
  try {
    const result = await client.execute("SELECT * FROM users");
    const users = result.rows;
    res.status(200).json(users);
  } catch (error) {
    console.error("Error al obtener usuarios", error);
    res.status(500).json({ message: "Error al obtener usuarios", error });
  }
};

exports.createUser = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  const id = uuidv4(); 
  const createdAt = new Date();
  const updatedAt = new Date();

  try {
    await client.execute(
      "INSERT INTO users (id, firstname, lastname, email, password, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [id, firstname, lastname, email, password, createdAt, updatedAt]
    );
    res.status(201).json({ message: "Usuario creado exitosamente" });
  } catch (error) {
    console.error("Error al crear usuario", error);
    res.status(500).json({ message: "Error al crear usuario", error });
  }
};


exports.profile = async (req, res) => {
  try {
    const userId = req.user.id; // id del usuario autenticado
    const user = await User.findByPk(userId, {
      attributes: ["id", "firstname", "lastname", "email"],
    });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el perfil" });
  }
};