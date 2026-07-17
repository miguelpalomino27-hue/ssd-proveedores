import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// Configurar variables de entorno
dotenv.config();

// Inicializar app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// 🔥 Ruta de prueba (IMPORTANTE para Railway)
app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

// 👉 Aquí luego vas a importar tus rutas
// import authRoutes from "./routes/auth.routes.js";
// app.use("/api/auth", authRoutes);

// import proveedoresRoutes from "./routes/proveedores.routes.js";
// app.use("/api/proveedores", proveedoresRoutes);

// Puerto dinámico (CLAVE para Railway)
const PORT = process.env.PORT || 4000;

// Levantar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});