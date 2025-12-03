import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useStore } from '@nanostores/react';
import { cartItems } from '../stores/cart';

// Replace with your actual publishable key
const stripePromise = loadStripe(import.meta.env.PUBLIC_STRIPE_KEY);

function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!stripe) {
            return;
        }

        const clientSecret = new URLSearchParams(window.location.search).get(
            "payment_intent_client_secret"
        );

        if (!clientSecret) {
            return;
        }

        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
            switch (paymentIntent?.status) {
                case "succeeded":
                    setMessage("Payment succeeded!");
                    break;
                case "processing":
                    setMessage("Your payment is processing.");
                    break;
                case "requires_payment_method":
                    setMessage("Your payment was not successful, please try again.");
                    break;
                default:
                    setMessage("Something went wrong.");
                    break;
            }
        });
    }, [stripe]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Make sure to change this to your payment completion page
                return_url: "http://localhost:4321/checkout",
            },
        });

        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message || "An unexpected error occurred.");
        } else {
            setMessage("An unexpected error occurred.");
        }

        setIsLoading(false);
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement id="payment-element" />
            <button disabled={isLoading || !stripe || !elements} id="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400">
                <span id="button-text">
                    {isLoading ? <div className="spinner" id="spinner">Processing...</div> : "Pay now"}
                </span>
            </button>
            {message && <div id="payment-message" className="text-red-500 text-sm text-center">{message}</div>}
        </form>
    );
}

export default function StripeCheckout() {
    const [clientSecret, setClientSecret] = useState("");
    const $cartItems = useStore(cartItems);
    const items = Object.values($cartItems);

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (items.length > 0) {
            const token = localStorage.getItem('auth_token');
            // Create PaymentIntent as soon as the page loads
            fetch("http://127.0.0.1:8000/api/create-payment-intent", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ items }),
            })
                .then((res) => {
                    if (!res.ok) throw new Error('Failed to initialize payment');
                    return res.json();
                })
                .then((data) => setClientSecret(data.clientSecret))
                .catch((err) => {
                    console.error("Error fetching payment intent:", err);
                    setError("Payment system is currently unavailable. Please check back later.");
                });
        }
    }, [JSON.stringify(items)]);

    const appearance = {
        theme: 'stripe',
    };
    const options = {
        clientSecret,
        appearance,
    };

    if (items.length === 0) {
        return <div className="text-center">Your cart is empty.</div>
    }

    return (
        <div className="App">
            {error ? (
                <div className="text-red-600 text-center p-4 bg-red-50 rounded-md">
                    <p>{error}</p>
                </div>
            ) : clientSecret ? (
                // @ts-ignore
                <Elements options={options} stripe={stripePromise}>
                    <CheckoutForm />
                </Elements>
            ) : (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            )}
        </div>
    );
}
