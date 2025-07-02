import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_YourPublishableKeyHere"); // replace with your Stripe publishable key

export default function Subscription() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubscribe = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8000/create-subscription-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "customer@example.com" }), // replace with dynamic email if you want
      });

      const { sessionId, error } = await response.json();

      if (error) {
        setError(error);
        setLoading(false);
        return;
      }

      const stripe = await stripePromise;
      const { error: stripeError } = await stripe.redirectToCheckout({ sessionId });

      if (stripeError) {
        setError(stripeError.message);
      }
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div>
      <button onClick={handleSubscribe} disabled={loading}>
        {loading ? "Redirecting..." : "Subscribe"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
