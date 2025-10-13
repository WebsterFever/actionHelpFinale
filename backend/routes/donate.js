

// module.exports = router;
const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { Donation } = require("../models");

router.post("/", async (req, res) => {
  const {
    amount,
    paymentMethodId,
    email,
    firstName,
    lastName,
    phone,
    isMonthly,
    isAnonymous,
    comment,
  } = req.body;

  console.log("📥 Donation Request:", req.body);

  try {
    if (isMonthly) {
      const customer = await stripe.customers.create({
        email,
        payment_method: paymentMethodId,
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });

      // ✅ Create a new product (can also reuse if desired)
      const product = await stripe.products.create({
        name: `Monthly Donation for ${firstName} ${lastName}`,
      });

      // ✅ Create a custom price with the user-defined amount
      const price = await stripe.prices.create({
        unit_amount: parseInt(amount) * 100, // convert to cents
        currency: "usd",
        recurring: { interval: "month" },
        product: product.id,
      });

      // ✅ Create the subscription
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: price.id }],
        expand: ["latest_invoice.payment_intent"],
      });

      await Donation.create({
        firstName,
        lastName,
        email,
        phone,
        amount,
        isMonthly: true,
        isAnonymous,
        comment,
        cardBrand: null,
        last4: null,
      });

      return res.status(200).json({
        success: true,
        subscriptionId: subscription.id,
      });
    }


    // ✅ One-time Payment (unchanged)
    const paymentIntent = await stripe.paymentIntents.create({
      
      amount: parseInt(amount) * 100,
      currency: "usd",
      payment_method: paymentMethodId,
      receipt_email: email,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
      expand: ["charges"],
    });

    let card = null;
    if (
      paymentIntent.charges &&
      paymentIntent.charges.data &&
      paymentIntent.charges.data.length > 0
    ) {
      card = paymentIntent.charges.data[0].payment_method_details.card;
    }

    await Donation.create({
      firstName,
      lastName,
      email,
      phone,
      amount,
      isMonthly: false,
      isAnonymous,
      comment,
      cardBrand: card?.brand || null,
      last4: card?.last4 || null,
    });

    res.status(200).json({ success: true, id: paymentIntent.id });
  } catch (err) {
    console.error("❌ Stripe error:", err.message);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
