import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CreditCard, Apple } from "lucide-react";

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ orderId }: { orderId: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment Successful",
        description: "Thank you for your order!",
      });
      navigate("/dashboard");
    }

    setProcessing(false);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <PaymentElement />
          <Button
            data-testid="button-pay-card"
            type="submit"
            disabled={!stripe || processing}
            className="w-full py-4 text-lg font-semibold flex items-center justify-center gap-2"
          >
            <CreditCard size={20} />
            {processing ? "Processing..." : "Pay with Card"}
          </Button>
        </form>
      </Card>
      
      <Button
        data-testid="button-apple-pay"
        className="w-full bg-black text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-900"
        disabled={processing}
      >
        <Apple size={20} />
        Pay with Apple Pay
      </Button>
    </div>
  );
};

export default function CheckoutPage() {
  const { user, loading, getToken } = useAuth();
  const [, navigate] = useLocation();
  const [clientSecret, setClientSecret] = useState("");
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const orderIdParam = params.get('orderId');
    
    if (!orderIdParam) {
      navigate("/dashboard");
      return;
    }

    setOrderId(orderIdParam);
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!orderId || !user) return;

    // Create PaymentIntent as soon as we have the order ID
    const createPaymentIntent = async () => {
      try {
        const token = await getToken();
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ 
            orderId,
            amount: 15.13 // This would normally come from the order
          }),
        });
        
        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error('Failed to create payment intent:', error);
        navigate("/dashboard");
      }
    };

    createPaymentIntent();
  }, [orderId, user, getToken, navigate]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="screen-container">
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Setting up payment...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="screen-container">
      {/* Status Bar */}
      <div className="status-bar">
        <span>9:41</span>
        <span>LaundryPro</span>
        <div className="flex items-center gap-1">
          <i className="fas fa-signal text-sm"></i>
          <i className="fas fa-wifi text-sm"></i>
          <i className="fas fa-battery-three-quarters text-sm"></i>
        </div>
      </div>

      {/* Checkout Screen */}
      <div className="min-h-screen bg-background">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-foreground mb-6">Checkout</h2>
          
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm orderId={orderId} />
          </Elements>
        </div>
      </div>
    </div>
  );
}
