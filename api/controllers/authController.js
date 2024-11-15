const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const client = require("../db");

const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey"; 

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await client.execute("SELECT * FROM users WHERE email = ? ALLOW FILTERING", [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login exitoso",
      token,
      user: {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error al hacer login", error);
    res.status(500).json({ message: "Error al hacer login", error });
  }
};
