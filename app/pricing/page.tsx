"use client";

import { useState, useEffect } from "react";
import { CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Navbar } from "@/components/shared/Navbar";
import { PricingSection } from "@/components/shared/PricingSection";

export default function PricingPage() {
  const [currentPlan, setCurrentPlan] = useState<"free" | "builder" | "team">("free");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCurrentPlan();
  }, []);

  const fetchCurrentPlan = async () => {
    try {
      const res = await fetch("/api/subscription");
      if (res.ok) {
        const data = await res.json();
        setCurrentPlan(data.subscription.plan);
      }
    } catch (error) {
      // Default to free if we can't fetch
      setCurrentPlan("free");
    }
  };

  const handleCheckout = async (plan: "builder" | "team", tierIndex: number) => {
    setIsCheckingOut(true);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          tierIndex,
          returnUrl: window.location.href,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        window.location.href = data.checkoutUrl;
      } else if (res.status === 503 && data.error === "Payment products not configured") {
        toast({
          title: "Payments Not Configured",
          description: "The payment system is not set up yet. Please contact support.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to create checkout session",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create checkout session",
        variant: "destructive",
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar title="Pricing" icon={CreditCard} />

      <main className="max-w-6xl mx-auto px-6 py-12">
        <PricingSection
          currentPlan={currentPlan}
          onCheckout={handleCheckout}
          isCheckingOut={isCheckingOut}
          variant="page"
        />
      </main>
    </div>
  );
}
