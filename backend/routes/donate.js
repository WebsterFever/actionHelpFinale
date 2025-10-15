

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

// const express = require("express");
// const router = express.Router();
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// console.log("🔑 Stripe key loaded?", !!process.env.STRIPE_SECRET_KEY);
// const { Donation } = require("../models");

// router.post("/", async (req, res) => {
//   try {
//     const {
//       amount,
//       paymentMethodId,
//       email,
//       firstName,
//       lastName,
//       phone,
//       isMonthly,
//       isAnonymous,
//       comment,
//     } = req.body;

//     // 🧠 Ensure numeric amount
//     const numericAmount = Number(amount);
//     if (!numericAmount || numericAmount <= 0) {
//       return res.status(400).json({ error: "Invalid donation amount." });
//     }

//     console.log("📥 Incoming donation:", {
//       amount: numericAmount,
//       email,
//       paymentMethodId,
//       isMonthly,
//     });

//     // 🧾 One-time OR monthly donation flow
//     if (isMonthly) {
//       // ✅ Create customer
//       const customer = await stripe.customers.create({
//         email,
//         payment_method: paymentMethodId,
//         invoice_settings: { default_payment_method: paymentMethodId },
//       });

//       // ✅ Create product and price
//       const product = await stripe.products.create({
//         name: `Monthly Donation for ${firstName} ${lastName}`,
//       });

//       const price = await stripe.prices.create({
//         unit_amount: numericAmount * 100,
//         currency: "usd",
//         recurring: { interval: "month" },
//         product: product.id,
//       });

//       // ✅ Create subscription
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
//         amount: numericAmount,
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

//     // ✅ One-time payment
//     // ✅ One-time payment
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: numericAmount * 100,
//       currency: "usd",
//       payment_method: paymentMethodId,
//       receipt_email: email,
//       confirm: true,
//       description: `One-time donation from ${firstName} ${lastName}`,
//       payment_method_types: ["card"], // 👈 Force card only — safest and simplest
//       expand: ["charges", "payment_method"],
//     });



//     // 🔍 Extract card details (if available)
//     const card =
//       paymentIntent.charges?.data?.[0]?.payment_method_details?.card || {};

//     await Donation.create({
//       firstName,
//       lastName,
//       email,
//       phone,
//       amount: numericAmount,
//       isMonthly: false,
//       isAnonymous,
//       comment,
//       cardBrand: card.brand || null,
//       last4: card.last4 || null,
//     });

//     console.log("✅ Donation processed:", paymentIntent.id);
//     res.status(200).json({ success: true, id: paymentIntent.id });
//   } catch (err) {
//     console.error("❌ Stripe error full object:", err);
//     if (err.raw) console.error("🔍 Stripe details:", err.raw);

//     // if Stripe already processed a charge, return success
//     if (err.payment_intent && err.payment_intent.status === "succeeded") {
//       console.log("✅ Payment succeeded on Stripe but response failed earlier");
//       return res.status(200).json({ success: true, id: err.payment_intent.id });
//     }

//     res.status(err.statusCode || 400).json({
//       success: false,
//       error: err.message || "Unknown Stripe error",
//       raw: err.raw || err,
//     });
//   }


// });

// module.exports = router;
// const express = require("express");
// const router = express.Router();
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// console.log("🔑 Stripe key loaded?", !!process.env.STRIPE_SECRET_KEY);
// const { Donation } = require("../models");

// router.post("/", async (req, res) => {
//   try {
//     const {
//       amount,
//       paymentMethodId,
//       email,
//       firstName,
//       lastName,
//       phone,
//       isMonthly,
//       isAnonymous,
//       comment,
//     } = req.body;

//     // 🧠 Ensure numeric amount
//     const numericAmount = Number(amount);
//     if (!numericAmount || numericAmount <= 0) {
//       return res.status(400).json({ error: "Invalid donation amount." });
//     }

//     console.log("📥 Incoming donation:", {
//       amount: numericAmount,
//       email,
//       paymentMethodId,
//       isMonthly,
//     });

//     // 🧾 One-time OR monthly donation flow
//     if (isMonthly) {
//       // ✅ Create customer
//       const customer = await stripe.customers.create({
//         email,
//         payment_method: paymentMethodId,
//         invoice_settings: { default_payment_method: paymentMethodId },
//       });

//       // ✅ Create product and price
//       const product = await stripe.products.create({
//         name: `Monthly Donation for ${firstName} ${lastName}`,
//       });

//       const price = await stripe.prices.create({
//         unit_amount: numericAmount * 100,
//         currency: "usd",
//         recurring: { interval: "month" },
//         product: product.id,
//       });

//       // ✅ Create subscription
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
//         amount: numericAmount,
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

//     // ✅ One-time payment
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: numericAmount * 100,
//       currency: "usd",
//       payment_method: paymentMethodId,
//       receipt_email: email,
//       confirm: true,
//       description: `One-time donation from ${firstName} ${lastName}`,
//       payment_method_types: ["card"],
//       expand: ["charges", "payment_method"],
//     });

//     // 🔍 Extract card details (if available)
//     const card =
//       paymentIntent.charges?.data?.[0]?.payment_method_details?.card || {};

//     await Donation.create({
//       firstName,
//       lastName,
//       email,
//       phone,
//       amount: numericAmount,
//       isMonthly: false,
//       isAnonymous,
//       comment,
//       cardBrand: card.brand || null,
//       last4: card.last4 || null,
//     });

//     console.log("✅ Donation processed:", paymentIntent.id);
//     res.status(200).json({ success: true, id: paymentIntent.id });
//   } catch (err) {
//     console.error("❌ Stripe error full object:", err);
//     if (err.raw) console.error("🔍 Stripe details:", err.raw);

//     // if Stripe already processed a charge, return success
//     if (err.payment_intent && err.payment_intent.status === "succeeded") {
//       console.log("✅ Payment succeeded on Stripe but response failed earlier");
//       return res.status(200).json({ success: true, id: err.payment_intent.id });
//     }

//     res.status(err.statusCode || 400).json({
//       success: false,
//       error: err.message || "Unknown Stripe error",
//       raw: err.raw || err,
//     });
//   }
// });

// module.exports = router;

// const express = require("express");
// const router = express.Router();
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// console.log("🔑 Stripe key loaded?", !!process.env.STRIPE_SECRET_KEY);

// // ✅ ADD ERROR HANDLING FOR MODELS
// let Donation;
// try {
//   Donation = require("../models").Donation;
//   console.log("✅ Donation model loaded");
// } catch (err) {
//   console.error("❌ Failed to load Donation model:", err.message);
//   // Don't crash the route, but handle gracefully
// }

// // ✅ ADD GET ROUTE FOR TESTING
// router.get("/", (req, res) => {
//   res.json({ 
//     message: "Donate API is working!", 
//     timestamp: new Date().toISOString(),
//     stripe: !!process.env.STRIPE_SECRET_KEY,
//     database: !!Donation
//   });
// });

// router.post("/", async (req, res) => {
//   // ✅ ADD INPUT VALIDATION
//   const {
//     amount,
//     paymentMethodId,
//     email,
//     firstName = "",
//     lastName = "",
//     phone = "",
//     isMonthly = false,
//     isAnonymous = false,
//     comment = "",
//   } = req.body;

//   if (!paymentMethodId) {
//     return res.status(400).json({ error: "Payment method ID is required." });
//   }
//   if (!email) {
//     return res.status(400).json({ error: "Email is required." });
//   }

//   // 🧠 Ensure numeric amount
//   const numericAmount = Number(amount);
//   if (!numericAmount || numericAmount <= 0) {
//     return res.status(400).json({ error: "Invalid donation amount." });
//   }

//   console.log("📥 Incoming donation:", {
//     amount: numericAmount,
//     email,
//     paymentMethodId,
//     isMonthly,
//   });

//   try {
//     // 🧾 One-time OR monthly donation flow
//     if (isMonthly) {
//       // ✅ Create customer
//       const customer = await stripe.customers.create({
//         email,
//         payment_method: paymentMethodId,
//         invoice_settings: { default_payment_method: paymentMethodId },
//       });

//       // ✅ Get payment method to extract card details
//       const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
//       const card = paymentMethod.card || {};

//       // ✅ Create product and price
//       const product = await stripe.products.create({
//         name: `Monthly Donation for ${firstName} ${lastName}`.substring(0, 100),
//       });

//       const price = await stripe.prices.create({
//         unit_amount: numericAmount * 100,
//         currency: "usd",
//         recurring: { interval: "month" },
//         product: product.id,
//       });

//       // ✅ Create subscription with proper settings
//       const subscription = await stripe.subscriptions.create({
//         customer: customer.id,
//         items: [{ price: price.id }],
//         expand: ["latest_invoice.payment_intent"],
//         payment_behavior: 'default_incomplete', // ✅ FIX
//         payment_settings: { save_default_payment_method: 'on_subscription' }, // ✅ FIX
//       });

//       // ✅ SAVE CARD DETAILS FOR MONTHLY TOO
//       if (Donation) {
//         await Donation.create({
//           firstName,
//           lastName,
//           email,
//           phone,
//           amount: numericAmount,
//           isMonthly: true,
//           isAnonymous,
//           comment,
//           cardBrand: card.brand || null,
//           last4: card.last4 || null,
//         });
//       }

//       return res.status(200).json({
//         success: true,
//         subscriptionId: subscription.id,
//         clientSecret: subscription.latest_invoice.payment_intent.client_secret,
//       });
//     }

//     // ✅ One-time payment
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: numericAmount * 100,
//       currency: "usd",
//       payment_method: paymentMethodId,
//       receipt_email: email,
//       confirm: true,
//       description: `One-time donation from ${firstName} ${lastName}`,
//       payment_method_types: ["card"],
//       expand: ["charges", "payment_method"],
//     });

//     // 🔍 Extract card details (if available)
//     const card =
//       paymentIntent.charges?.data?.[0]?.payment_method_details?.card || {};

//     // ✅ SAVE TO DATABASE IF MODEL IS AVAILABLE
//     if (Donation) {
//       await Donation.create({
//         firstName,
//         lastName,
//         email,
//         phone,
//         amount: numericAmount,
//         isMonthly: false,
//         isAnonymous,
//         comment,
//         cardBrand: card.brand || null,
//         last4: card.last4 || null,
//       });
//     } else {
//       console.warn("⚠️ Database not available - donation not saved");
//     }

//     console.log("✅ Donation processed:", paymentIntent.id);
//     res.status(200).json({ success: true, id: paymentIntent.id });
//   } catch (err) {
//     console.error("❌ Stripe error:", err.message);
//     console.error("🔍 Stripe error details:", err.type, err.code);

//     // if Stripe already processed a charge, return success
//     if (err.payment_intent && err.payment_intent.status === "succeeded") {
//       console.log("✅ Payment succeeded on Stripe but response failed earlier");
//       return res.status(200).json({ success: true, id: err.payment_intent.id });
//     }

//     res.status(err.statusCode || 400).json({
//       success: false,
//       error: err.message || "Payment processing failed",
//       type: err.type,
//       code: err.code,
//     });
//   }
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

console.log("🔑 Stripe key loaded?", !!process.env.STRIPE_SECRET_KEY);

// ✅ ADD ERROR HANDLING FOR MODELS
let Donation;
try {
  Donation = require("../models").Donation;
  console.log("✅ Donation model loaded");
} catch (err) {
  console.error("❌ Failed to load Donation model:", err.message);
  // Don't crash the route, but handle gracefully
}

// ✅ ADD GET ROUTE FOR TESTING
router.get("/", (req, res) => {
  res.json({ 
    message: "Donate API is working!", 
    timestamp: new Date().toISOString(),
    stripe: !!process.env.STRIPE_SECRET_KEY,
    database: !!Donation
  });
});

// ✅ ADD TEST POST ROUTE FOR DEBUGGING
router.post("/test", async (req, res) => {
  console.log("🧪 Test donation received:", req.body);
  
  // Simulate a successful payment
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  res.json({
    success: true,
    message: "Test donation processed successfully",
    test: true,
    id: "pi_test_" + Date.now(),
    timestamp: new Date().toISOString()
  });
});

router.post("/", async (req, res) => {
  console.log("🎯 REAL donation request received");
  console.log("📦 Full request body:", JSON.stringify(req.body, null, 2));

  // ✅ ADD INPUT VALIDATION
  const {
    amount,
    paymentMethodId,
    email,
    firstName = "",
    lastName = "",
    phone = "",
    isMonthly = false,
    isAnonymous = false,
    comment = "",
  } = req.body;

  if (!paymentMethodId) {
    console.log("❌ Missing paymentMethodId");
    return res.status(400).json({ error: "Payment method ID is required." });
  }
  if (!email) {
    console.log("❌ Missing email");
    return res.status(400).json({ error: "Email is required." });
  }

  // 🧠 Ensure numeric amount
  const numericAmount = Number(amount);
  if (!numericAmount || numericAmount <= 0) {
    console.log("❌ Invalid amount:", amount);
    return res.status(400).json({ error: "Invalid donation amount." });
  }

  console.log("📥 Incoming donation details:", {
    amount: numericAmount,
    email,
    paymentMethodId: paymentMethodId.substring(0, 20) + "...", // Log partial for security
    isMonthly,
    firstName,
    lastName
  });

  try {
    // 🧾 One-time OR monthly donation flow
    if (isMonthly) {
      console.log("🔄 Processing MONTHLY donation");
      
      // ✅ Create customer
      const customer = await stripe.customers.create({
        email,
        payment_method: paymentMethodId,
        invoice_settings: { default_payment_method: paymentMethodId },
      });
      console.log("✅ Customer created:", customer.id);

      // ✅ Get payment method to extract card details
      const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
      const card = paymentMethod.card || {};
      console.log("✅ Payment method retrieved, card:", card.brand, "****", card.last4);

      // ✅ Create product and price
      const product = await stripe.products.create({
        name: `Monthly Donation for ${firstName} ${lastName}`.substring(0, 100),
      });
      console.log("✅ Product created:", product.id);

      const price = await stripe.prices.create({
        unit_amount: numericAmount * 100,
        currency: "usd",
        recurring: { interval: "month" },
        product: product.id,
      });
      console.log("✅ Price created:", price.id);

      // ✅ Create subscription with proper settings
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: price.id }],
        expand: ["latest_invoice.payment_intent"],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
      });
      console.log("✅ Subscription created:", subscription.id);

      // ✅ SAVE CARD DETAILS FOR MONTHLY TOO
      if (Donation) {
        try {
          const donationRecord = await Donation.create({
            firstName,
            lastName,
            email,
            phone,
            amount: numericAmount,
            isMonthly: true,
            isAnonymous,
            comment,
            cardBrand: card.brand || null,
            last4: card.last4 || null,
            status: 'completed'
          });
          console.log("✅ Monthly donation saved to database:", donationRecord.id);
        } catch (dbError) {
          console.error("❌ Database save failed:", dbError.message);
          // Continue even if database fails
        }
      } else {
        console.warn("⚠️ Database not available - monthly donation not saved");
      }

      console.log("🎉 Monthly donation completed successfully");
      return res.status(200).json({
        success: true,
        subscriptionId: subscription.id,
        clientSecret: subscription.latest_invoice.payment_intent.client_secret,
      });
    }

    // ✅ One-time payment
    console.log("💳 Processing ONE-TIME donation");
    const paymentIntent = await stripe.paymentIntents.create({
      amount: numericAmount * 100,
      currency: "usd",
      payment_method: paymentMethodId,
      receipt_email: email,
      confirm: true,
      description: `One-time donation from ${firstName} ${lastName}`,
      payment_method_types: ["card"],
      expand: ["charges", "payment_method"],
    });

    console.log("✅ PaymentIntent created:", {
      id: paymentIntent.id,
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      charges: paymentIntent.charges?.data?.length
    });

    // 🔍 Extract card details (if available)
    const card = paymentIntent.charges?.data?.[0]?.payment_method_details?.card || {};
    console.log("✅ Card details:", {
      brand: card.brand,
      last4: card.last4,
      country: card.country
    });

    // ✅ SAVE TO DATABASE IF MODEL IS AVAILABLE
    if (Donation) {
      try {
        const donationRecord = await Donation.create({
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
          status: 'completed'
        });
        console.log("✅ One-time donation saved to database:", donationRecord.id);
      } catch (dbError) {
        console.error("❌ Database save failed:", dbError.message);
        // Don't fail the payment if database save fails
        console.log("⚠️ Payment succeeded but not saved to database");
      }
    } else {
      console.warn("⚠️ Database not available - donation not saved");
    }

    console.log("🎉 One-time donation completed successfully");
    res.status(200).json({ 
      success: true, 
      id: paymentIntent.id,
      message: "Donation processed successfully"
    });

  } catch (err) {
    console.error("❌ STRIPE ERROR DETAILS:");
    console.error("🔍 Error message:", err.message);
    console.error("🔍 Error type:", err.type);
    console.error("🔍 Error code:", err.code);
    console.error("🔍 Error statusCode:", err.statusCode);
    console.error("🔍 Error decline_code:", err.decline_code);
    console.error("🔍 Error param:", err.param);
    console.error("🔍 Error raw:", err.raw);
    console.error("🔍 Full error stack:", err.stack);

    // ✅ if Stripe already processed a charge, return success
    if (err.payment_intent && err.payment_intent.status === "succeeded") {
      console.log("✅ Payment succeeded on Stripe but response failed earlier");
      
      // Try to save to database even in error case
      if (Donation && req.body) {
        try {
          await Donation.create({
            firstName: req.body.firstName || "",
            lastName: req.body.lastName || "",
            email: req.body.email || "",
            phone: req.body.phone || "",
            amount: numericAmount,
            isMonthly: false,
            isAnonymous: req.body.isAnonymous || false,
            comment: req.body.comment || "",
            cardBrand: null,
            last4: null,
            status: 'completed_after_error'
          });
          console.log("✅ Donation saved after error recovery");
        } catch (dbError) {
          console.error("❌ Database save failed in error recovery:", dbError);
        }
      }
      
      return res.status(200).json({ 
        success: true, 
        id: err.payment_intent.id,
        recovered: true 
      });
    }

    // ✅ Better error response
    const errorResponse = {
      success: false,
      error: err.message || "Payment processing failed",
      type: err.type,
      code: err.code,
      decline_code: err.decline_code,
      param: err.param,
    };

    console.log("🚨 Sending error response to frontend:", errorResponse);
    res.status(err.statusCode || 400).json(errorResponse);
  }
});

module.exports = router;