const express = require("express");
const path = require("path");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const app = express();

app.use(express.json());

// Servir archivos estáticos correctamente
app.use(express.static(path.join(__dirname)));

// Ruta principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "reserva.html"));
});

// Crear sesión Stripe
app.post("/crear-sesion", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Pago Dominia Reserva"
            },
            unit_amount: 10000
          },
          quantity: 1
        }
      ],
      success_url: "https://dominiareserva.onrender.com/exito.html",
cancel_url: "https://dominiareserva.onrender.com/"
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Servidor activo en http://localhost:3000");
});

