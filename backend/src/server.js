import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 Ruta raíz
app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

// 🔥 👉 RUTA QUE TE FALTA (CLAVE)
app.get("/api/proveedores", (req, res) => {
  res.json([
    {
      id: 1,
      razon_social: "Proveedor Tech SAC",
      ruc: "20123456789",
      rubro: "Tecnología",
      telefono: "987654321"
    },
    {
      id: 2,
      razon_social: "Servicios Industriales SRL",
      ruc: "20987654321",
      rubro: "Industria",
      telefono: "912345678"
    }
  ]);
});

// Puerto Railway
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});