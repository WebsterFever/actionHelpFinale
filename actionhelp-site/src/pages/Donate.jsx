import React, { useState } from "react";
import styles from "./Donate.module.css";
import { useLanguage } from "../context/LanguageContext";
import axios from "axios";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";

const countries = [
  "United States",
  "Canada",
  "United Kingdom",
  "France",
  "Germany",
  "Haiti",
  "Brazil",
  "Mexico",
  "Italy",
  "India",
  "Australia",
  "Spain",
  "Portugal",
  "Netherlands",
  "Sweden",
  "Norway",
  "Switzerland",
  "South Africa",
  "Nigeria",
  "Kenya",
  "Ghana",
  "Jamaica",
  "Cuba",
  "Dominican Republic",
  "Chile",
  "Colombia",
  "Argentina",
  "Japan",
  "South Korea",
  "Philippines",
  "China",
  "Indonesia",
  "Pakistan",
  "Bangladesh",
  "Vietnam",
  "Egypt",
  "Morocco",
  "Algeria"
];


const cardStyle = {
  style: {
    base: {
      color: "#ffffff", // white text
      fontSize: "16px",
      "::placeholder": {
        color: " rgb(96, 5, 5)", // light gray placeholder
      },
      iconColor: "#ffffff", // white icon
    },
    invalid: {
      color: "#ff6b6b", // red on error
    },
  },
};

const Donate = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const stripe = useStripe();
  const elements = useElements();
  const [errors, setErrors] = useState({});

  const [step, setStep] = useState(1);
  const [isMonthly, setIsMonthly] = useState(false);
  const [form, setForm] = useState({
    amount: 100,
    custom: "",
    name: "",
    email: "",
    phone: "",
    card: "",
    city: "",
    zip: "",
    country: "",
    address1: "",
    address2: "",
    exp: "",
    cvc: "",
    comment: "",
    isAnonymous: false,
    isCompany: false,
    firstName: "",
    lastName: "",
    state: "",
  });

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);
  const jumpToStep = (target) => setStep(target);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleAmountSelect = (val) => {
    setForm({ ...form, amount: val.toString(), custom: val.toString() });
  };

  const handleSubmit = async () => {
    if (!stripe || !elements) return;

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement),
        billing_details: {
          name: `${form.firstName} ${form.lastName}`,
          email: form.email,
          phone: form.phone,
        },
      });

      if (error) {
        alert(error.message);
        return;
      }

      const response = await axios.post("http://localhost:5000/api/donate", {
        paymentMethodId: paymentMethod.id,
        amount: form.custom || form.amount,
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        isMonthly,
        isAnonymous: form.isAnonymous,
        comment: form.comment,
      });

      if (response.data.success) {
        setStep(1);
        setForm({ ...form, custom: "", comment: "" });
        navigate("/donation-success"); // ✅ Redirect to success page
      }
    } catch (err) {
      console.error("❌ Donation error:", err);
      alert("Payment failed. Please try again.");
    }
  };

  const handleDonate = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!form.firstName) newErrors.firstName = "First name is required.";
    if (!form.lastName) newErrors.lastName = "Last name is required.";
    if (!form.email) newErrors.email = "Email is required.";
    if (!form.phone) newErrors.phone = "Phone number is required.";
   

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // Stop the donation process
    }

    setErrors({}); // Clear errors if valid

    // 🔽 continue with Stripe or Axios request here
    await handleSubmit();
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{t.donate.title}</h2>
      <div className={styles.card}>
        {step === 1 && (
          <>
            <h3>{t.donate.description}</h3>
            <button onClick={handleNext} className={styles.primaryBtn}>
              {t.donate.button}
            </button>
            <p className={styles.secure}>{t.donate.secure}</p>
          </>
        )}

        {step === 2 && (
          <>
            <h3>{t.donate.chooseAmount}</h3>
            <input
              type="number"
              name="custom"
              value={form.custom}
              placeholder={t.donate.customAmount}
              onChange={handleChange}
              className={styles.input}
            />
            <div className={styles.amountOptions}>
              {[50, 100, 250, 500, 1000].map((val) => (
                <button
                  key={val}
                  onClick={() => handleAmountSelect(val)}
                  className={`${styles.amountBtn} ${
                    form.amount === val.toString() ? styles.selected : ""
                  }`}
                >
                  ${val}
                </button>
              ))}
            </div>
            <label className={styles.monthlyToggle}>
              <input
                type="checkbox"
                checked={isMonthly}
                onChange={() => setIsMonthly(!isMonthly)}
              />
              {t.donate.monthly}
            </label>
            <button onClick={handleNext} className={styles.primaryBtn}>
              {t.donate.continue}
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <h3>{t.donate.fillInfo}</h3>
            <div className={styles.inputRow}>
              <input
                type="text"
                name="firstName"
                placeholder={t.donate.cardDetails.firstName}
                value={form.firstName}
                onChange={handleChange}
                className={styles.input}
                required
              />
              {errors.firstName && (
                <p className={styles.error}>{errors.firstName}</p>
              )}
              <input
                type="text"
                name="lastName"
                placeholder={t.donate.cardDetails.lastName}
                value={form.lastName}
                onChange={handleChange}
                className={styles.input}
                required
              />
              {errors.lastName && (
                <p className={styles.error}>{errors.lastName}</p>
              )}
            </div>
            <div className={styles.radioGroup}>
              <span>{t.donate.cardDetails.companyDonation}</span>
              <label>
                <input
                  type="radio"
                  name="isCompany"
                  value="false"
                  checked={!form.isCompany}
                  onChange={() => setForm({ ...form, isCompany: false })}
                />{" "}
                No
              </label>
              <label>
                <input
                  type="radio"
                  name="isCompany"
                  value="true"
                  checked={form.isCompany}
                  onChange={() => setForm({ ...form, isCompany: true })}
                />{" "}
                Yes
              </label>
            </div>
            <input
              type="email"
              name="email"
              placeholder={t.donate.cardDetails.email}
              value={form.email}
              onChange={handleChange}
              className={styles.input}
              required
            />
            {errors.email && <p className={styles.error}>{errors.email}</p>}

            <label>
              <input
                type="checkbox"
                name="isAnonymous"
                checked={form.isAnonymous}
                onChange={handleChange}
              />{" "}
              {t.donate.cardDetails.anonymous}
            </label>
            <textarea
              name="comment"
              placeholder={t.donate.cardDetails.comment}
              value={form.comment}
              onChange={handleChange}
              className={styles.input}
            />
            <input
              type="tel"
              name="phone"
              placeholder={t.donate.cardDetails.phone}
              value={form.phone}
              onChange={handleChange}
              className={styles.input}
              required
            />
            {errors.phone && <p className={styles.error}>{errors.phone}</p>}

            <input
              type="text"
              name="card"
              placeholder={t.donate.cardDetails.name}
              value={form.card}
              onChange={handleChange}
              className={styles.input}
              required
            />
            {errors.cardholderName && (
              <p className={styles.error}>{errors.cardholderName}</p>
            )}
            <div className={styles.cardInputGroup}>
              <label className={styles.inputLabel}></label>
              <CardElement className={styles.stripeInput} options={cardStyle} />
            </div>

            <select
              name="country"
              value={form.country}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="">Select Country</option>
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="address1"
              placeholder={t.donate.cardDetails.address1}
              value={form.address1}
              onChange={handleChange}
              className={styles.input}
            />

            <input
              type="text"
              name="city"
              placeholder={t.donate.cardDetails.city}
              value={form.city}
              onChange={handleChange}
              className={styles.input}
            />

            <div className={styles.summary}>
              <h4>
                {t.donate.summary}
                <span onClick={() => jumpToStep(2)} className={styles.editLink}>
                  Edit Donation
                </span>
              </h4>
              <p>
                <strong>Payment Amount:</strong> ${form.custom || form.amount}
              </p>
              <p>
                <strong>Giving Frequency:</strong>{" "}
                {isMonthly ? "Monthly" : "One time"}
              </p>
              <p>
                <strong>Donation Total:</strong> ${form.custom || form.amount}
              </p>
            </div>

            <form onSubmit={handleDonate}>
              <button type="submit" className={styles.primaryBtn}>
                {t.donate.finalButton}
              </button>
            </form>

            <button onClick={handleBack} className={styles.backBtn}>
              {t.donate.back}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Donate;
