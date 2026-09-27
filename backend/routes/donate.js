const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const { Donation } = require("../models");

router.post("/", async (req, res) => {
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
    return res.status(400).json({ error: "Payment method ID is required." });
  }
  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }

  // 🧠 Ensure numeric amount
  const numericAmount = Number(amount);
  const amountInCents = Math.round(numericAmount * 100);
  if (!Number.isFinite(numericAmount) || amountInCents < 50 || amountInCents > 99999999 ||
      Math.abs(amountInCents / 100 - numericAmount) > 0.000001) {
    return res.status(400).json({ error: "Invalid donation amount." });
  }

  try {
    // 🧾 One-time OR monthly donation flow
    if (isMonthly) {

      
      // ✅ Create customer
      const customer = await stripe.customers.create({
        email,
        payment_method: paymentMethodId,
        invoice_settings: { default_payment_method: paymentMethodId },
      });


      // ✅ Get payment method to extract card details
      const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
      const card = paymentMethod.card || {};


      // ✅ Create product and price
      const product = await stripe.products.create({
        name: `Monthly Donation for ${firstName} ${lastName}`.substring(0, 100),
      });


      const price = await stripe.prices.create({
        unit_amount: amountInCents,
        currency: "usd",
        recurring: { interval: "month" },
        product: product.id,
      });


      // ✅ Create subscription with proper settings
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: price.id }],
        expand: ["latest_invoice.payment_intent"],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
      });


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
            status: 'pending'
          });

        } catch (dbError) {
          console.error("❌ Database save failed:", dbError.message);
          // Continue even if database fails
        }
      } else {
        console.warn("⚠️ Database not available - monthly donation not saved");
      }


      return res.status(200).json({
        success: true,
        subscriptionId: subscription.id,
        clientSecret: subscription.latest_invoice.payment_intent.client_secret,
      });
    }

    // ✅ One-time payment

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      payment_method: paymentMethodId,
      receipt_email: email,
      confirm: true,
      description: `One-time donation from ${firstName} ${lastName}`,
      payment_method_types: ["card"],
      expand: ["charges", "payment_method"],
    });

    const card = paymentIntent.charges?.data?.[0]?.payment_method_details?.card || {};
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

      } catch (dbError) {
        console.error("❌ Database save failed:", dbError.message);
        // Don't fail the payment if database save fails
        console.log("⚠️ Payment succeeded but not saved to database");
      }
    } else {
      console.warn("⚠️ Database not available - donation not saved");
    }


    res.status(200).json({ 
      success: true, 
      id: paymentIntent.id,
      message: "Donation processed successfully"
    });

  } catch (err) {
    console.error("Donation payment error:", err.message);

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

    res.status(err.statusCode >= 400 && err.statusCode < 500 ? err.statusCode : 400).json(errorResponse);
  }
});

module.exports = router;