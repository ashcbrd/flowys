"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  ArrowLeft,
  Building2,
  Mail,
  MessageSquare,
  Send,
  Loader2,
  CheckCircle,
  Users,
  Zap,
  Shield,
  Headphones,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const enterpriseFeatures = [
  {
    icon: Zap,
    title: "100,000+ Credits",
    description: "High-volume credit packages for large-scale automation",
  },
  {
    icon: Shield,
    title: "Custom SLAs",
    description: "Guaranteed uptime and response times tailored to your needs",
  },
  {
    icon: Building2,
    title: "On-Premise Deployment",
    description: "Deploy Flowys in your own infrastructure for maximum control",
  },
  {
    icon: Users,
    title: "Dedicated Support",
    description: "A dedicated account manager and priority technical support",
  },
];

export default function ContactPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    company: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.company || !formData.message) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsSubmitted(true);
        toast({
          title: "Message Sent",
          description: "We'll get back to you within 24 hours",
        });
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="font-semibold text-lg">Flowys</span>
          </Link>
          <Link href="/pricing">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Pricing
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left: Info */}
          <div>
            <h1 className="text-4xl font-bold mb-4">Enterprise Solutions</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Get a custom plan tailored to your organization&apos;s needs. Our enterprise
              solutions are designed for teams that need more power, security, and support.
            </p>

            <div className="space-y-6">
              {enterpriseFeatures.map((feature) => (
                <div key={feature.title} className="flex gap-4">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 p-6 bg-muted/50 rounded-xl">
              <h3 className="font-semibold mb-2">Prefer email?</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Reach out directly to our enterprise team:
              </p>
              <a
                href="mailto:enterprise@flowys.io"
                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium hover:underline"
              >
                <Mail className="h-4 w-4" />
                enterprise@flowys.io
              </a>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="bg-card border rounded-2xl p-8 shadow-lg h-fit">
            {isSubmitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
                <p className="text-muted-foreground mb-6">
                  We&apos;ve received your message and will get back to you within 24 hours.
                </p>
                <Link href="/workflow">
                  <Button>
                    Return to Workflow Editor
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Contact Sales</h2>
                    <p className="text-sm text-muted-foreground">Tell us about your needs</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Name</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Work Email</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@company.com"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Company</label>
                    <Input
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Your company name"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Message</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about your use case, team size, and any specific requirements..."
                      rows={4}
                      className={cn(
                        "w-full rounded-lg border bg-background px-4 py-3 text-sm resize-none",
                        "focus:outline-none focus:ring-2 focus:ring-ring",
                        "placeholder:text-muted-foreground"
                      )}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    We typically respond within 24 hours
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
