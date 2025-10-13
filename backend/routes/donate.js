

// // module.exports = router;
// const express = require("express");
// const router = express.Router();
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// const { Donation } = require("../models");

// router.post("/", async (req, res) => {
//   const {
//     amount,
//     paymentMethodId,
//     email,
//     firstName,
//     lastName,
//     phone,
//     isMonthly,
//     isAnonymous,
//     comment,
//   } = req.body;

//   console.log("📥 Donation Request:", req.body);

//   try {
//     if (isMonthly) {
//       const customer = await stripe.customers.create({
//         email,
//         payment_method: paymentMethodId,
//         invoice_settings: {
//           default_payment_method: paymentMethodId,
//         },
//       });

//       // ✅ Create a new product (can also reuse if desired)
//       const product = await stripe.products.create({
//         name: `Monthly Donation for ${firstName} ${lastName}`,
//       });

//       // ✅ Create a custom price with the user-defined amount
//       const price = await stripe.prices.create({
//         unit_amount: parseInt(amount) * 100, // convert to cents
//         currency: "usd",
//         recurring: { interval: "month" },
//         product: product.id,
//       });

//       // ✅ Create the subscription
//       const subscription = await stripe.subscriptions.create({
//         customer: customer.id,
//         items: [{ price: price.id }],
//         expand: ["latest_invoice.payment_intent"],
//       });

//       await Donation.create({
//         firstName,
//         lastName,
//         email,
//         phone,
//         amount,
//         isMonthly: true,
//         isAnonymous,
//         comment,
//         cardBrand: null,
//         last4: null,
//       });

//       return res.status(200).json({
//         success: true,
//         subscriptionId: subscription.id,
//       });
//     }


//     // ✅ One-time Payment (unchanged)
//     const paymentIntent = await stripe.paymentIntents.create({
      
//       amount: parseInt(amount) * 100,
//       currency: "usd",
//       payment_method: paymentMethodId,
//       receipt_email: email,
//       confirm: true,
//       automatic_payment_methods: {
//         enabled: true,
//         allow_redirects: "never",
//       },
//       expand: ["charges"],
//     });

//     let card = null;
//     if (
//       paymentIntent.charges &&
//       paymentIntent.charges.data &&
//       paymentIntent.charges.data.length > 0
//     ) {
//       card = paymentIntent.charges.data[0].payment_method_details.card;
//     }

//     await Donation.create({
//       firstName,
//       lastName,
//       email,
//       phone,
//       amount,
//       isMonthly: false,
//       isAnonymous,
//       comment,
//       cardBrand: card?.brand || null,
//       last4: card?.last4 || null,
//     });

//     res.status(200).json({ success: true, id: paymentIntent.id });
//   } catch (err) {
//     console.error("❌ Stripe error:", err.message);
//     res.status(400).json({ error: err.message });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

console.log("🔑 Stripe key loaded?", !!process.env.STRIPE_SECRET_KEY);
const { Donation } = require("../models");

router.post("/", async (req, res) => {
  try {
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

    // 🧠 Ensure numeric amount
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      return res.status(400).json({ error: "Invalid donation amount." });
    }

    console.log("📥 Incoming donation:", {
      amount: numericAmount,
      email,
      paymentMethodId,
      isMonthly,
    });

    // 🧾 One-time OR monthly donation flow
    if (isMonthly) {
      // ✅ Create customer
      const customer = await stripe.customers.create({
        email,
        payment_method: paymentMethodId,
        invoice_settings: { default_payment_method: paymentMethodId },
      });

      // ✅ Create product and price
      const product = await stripe.products.create({
        name: `Monthly Donation for ${firstName} ${lastName}`,
      });

      const price = await stripe.prices.create({
        unit_amount: numericAmount * 100,
        currency: "usd",
        recurring: { interval: "month" },
        product: product.id,
      });

      // ✅ Create subscription
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
        amount: numericAmount,
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

    // ✅ One-time payment
   const paymentIntent = await stripe.paymentIntents.create({
  amount: numericAmount * 100,
  currency: "usd",
  payment_method: paymentMethodId,
  receipt_email: email,
  confirm: true,
  description: `One-time donation from ${firstName} ${lastName}`,
  automatic_payment_methods: {
    enabled: true,
    allow_redirects: "never", // 👈 this line fixes the issue
  },
  expand: ["charges", "payment_method"],
});


    // 🔍 Extract card details (if available)
    const card =
      paymentIntent.charges?.data?.[0]?.payment_method_details?.card || {};

    await Donation.create({
      firstName,
      lastName,
      email,
      phone,
      amount: numericAmount,
      isMonthly: false,
      isAnonymous,
      comment,
      cardBrand: card.brand || null,
      last4: card.last4 || null,
    });

    console.log("✅ Donation processed:", paymentIntent.id);
    res.status(200).json({ success: true, id: paymentIntent.id });
  } catch (err) {
    console.error("❌ Stripe error:", err.message);
    if (err.raw) console.error("🔍 Stripe details:", err.raw);
    res.status(err.statusCode || 400).json({
      success: false,
      error: err.message,
      type: err.type || "StripeError",
    });
  }
});

module.exports = router;
