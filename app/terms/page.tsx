"use client";

import Link from "next/link";
import { Zap, ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">Flowys</span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-foreground mb-8">
          Terms of Service
        </h1>
        <p className="text-muted-foreground mb-8">
          Last updated:{" "}
          {new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          {/* 1 */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              1. Agreement to Terms
            </h2>
            <p className="text-muted-foreground">
              By accessing or using Flowys, you agree to be bound by these Terms
              of Service and all applicable laws and regulations. If you do not
              agree with any of these terms, you are prohibited from using or
              accessing this service.
            </p>
          </section>

          {/* 2 */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              2. Description of Service
            </h2>
            <p className="text-muted-foreground">
              Flowys is a workflow automation platform that allows users to
              create, manage, and execute automated workflows using a visual
              node-based interface. The service includes AI-powered nodes,
              webhook integrations, API connections, and other automation
              features.
            </p>
          </section>

          {/* 3 */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              3. Account Registration
            </h2>
            <p className="text-muted-foreground mb-4">
              To use certain features of the service, you must register for an
              account. You agree to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>
                Accept responsibility for all activities under your account
              </li>
            </ul>
          </section>

          {/* 4 */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              4. Credits and Billing
            </h2>
            <p className="text-muted-foreground mb-4">
              Our service operates on a credit-based system. By subscribing to a
              plan, you agree to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Pay all fees associated with your selected plan</li>
              <li>
                Credits are consumed based on workflow execution and node types
                used
              </li>
              <li>Unused credits may roll over based on your plan type</li>
              <li>
                Refunds are provided at our discretion and in accordance with
                applicable law
              </li>
            </ul>
          </section>

          {/* 5 */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              5. Acceptable Use
            </h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on the rights of others</li>
              <li>Distribute malware, spam, or harmful content</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the service</li>
              <li>Use the service for any illegal or unauthorized purpose</li>
            </ul>
          </section>

          {/* 6–12 unchanged text, styled */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              6. Intellectual Property
            </h2>
            <p className="text-muted-foreground">
              Flowys owns the service and its features. You retain ownership of
              your workflows and data.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              7. Third-Party Integrations
            </h2>
            <p className="text-muted-foreground">
              Use of third-party services is governed by their own policies.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              8. Service Availability
            </h2>
            <p className="text-muted-foreground">
              We do not guarantee uninterrupted service.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              9. Limitation of Liability
            </h2>
            <p className="text-muted-foreground">
              Flowys is not liable for indirect or consequential damages.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              10. Termination
            </h2>
            <p className="text-muted-foreground">
              We may suspend or terminate accounts that violate these terms.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              11. Changes
            </h2>
            <p className="text-muted-foreground">
              Terms may be updated and posted on this page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              12. Contact
            </h2>
            <p className="text-muted-foreground">legal@flowys.io</p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border bg-background">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Flowys. All rights reserved.
          </p>
          <Link
            href="/privacy"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Privacy Policy
          </Link>
        </div>
      </footer>
    </div>
  );
}
