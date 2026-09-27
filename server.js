// =====================================================
// Evidencia GA7-220501096-AA5-EV01
// Servicio web de registro e inicio de sesión (API REST)
// =====================================================

const express = require("express");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

const app = express();
const PUERTO = 8080;

// Archivo JSON donde se guardan los usuarios registrados
const ARCHIVO_USUARIOS = path.join(__dirname, "usuarios.json");

// Middleware: permite leer el cuerpo de las peticiones en formato JSON
app.use(express.json());

// ---------- Funciones auxiliares ----------

// Lee los usuarios del archivo JSON (si no existe, devuelve una lista vacía)
function leerUsuarios() {
  if (!fs.existsSync(ARCHIVO_USUARIOS)) return [];
  const contenido = fs.readFileSync(ARCHIVO_USUARIOS, "utf8");
  return contenido ? JSON.parse(contenido) : [];
}

// Guarda la lista de usuarios en el archivo JSON
function guardarUsuarios(usuarios) {
  fs.writeFileSync(ARCHIVO_USUARIOS, JSON.stringify(usuarios, null, 2));
}

// ---------- Endpoints ----------

// POST /registro
// Body: { "usuario": "juan", "contrasena": "1234" }
app.post("/registro", async (req, res) => {
  const { usuario, contrasena } = req.body;

  // Validar que lleguen los dos campos
  if (!usuario || !contrasena) {
    return res.status(400).json({
      mensaje: "Debe enviar usuario y contrasena",
    });
  }

  const usuarios = leerUsuarios();

  // Validar que el usuario no exista ya
  if (usuarios.find((u) => u.usuario === usuario)) {
    return res.status(409).json({
      mensaje: "El usuario ya existe",
    });
  }

  // Encriptar la contraseña antes de guardarla (nunca en texto plano)
  const contrasenaEncriptada = await bcrypt.hash(contrasena, 10);

  usuarios.push({ usuario, contrasena: contrasenaEncriptada });
  guardarUsuarios(usuarios);

  res.status(201).json({ mensaje: "Usuario registrado correctamente" });
});

// POST /login
// Body: { "usuario": "juan", "contrasena": "1234" }
app.post("/login", async (req, res) => {
  const { usuario, contrasena } = req.body;

  if (!usuario || !contrasena) {
    return res.status(400).json({
      mensaje: "Debe enviar usuario y contrasena",
    });
  }

  // Buscar el usuario en el archivo
  const usuarios = leerUsuarios();
  const encontrado = usuarios.find((u) => u.usuario === usuario);

  // Comparar la contraseña enviada con la encriptada guardada
  const coincide =
    encontrado && (await bcrypt.compare(contrasena, encontrado.contrasena));

  if (!coincide) {
    // Autenticación incorrecta -> error
    return res.status(401).json({ mensaje: "Error en la autenticación" });
  }

  // Autenticación correcta
  res.status(200).json({ mensaje: "Autenticación satisfactoria" });
});

// ---------- Iniciar el servidor ----------
app.listen(PUERTO, () => {
  console.log(`Servidor corriendo en http://localhost:${PUERTO}`);
});
