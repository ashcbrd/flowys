import { NextRequest, NextResponse } from "next/server";

interface ContactFormData {
  name: string;
  email: string;
  company: string;
  message: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: ContactFormData = await req.json();

    const { name, email, company, message } = body;

    // Validate required fields
    if (!name || !email || !company || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Log the contact form submission
    // In production, this could:
    // - Send an email to the sales team
    // - Create a lead in a CRM (HubSpot, Salesforce, etc.)
    // - Store in database
    // - Send to Slack channel
    console.log("Enterprise Contact Form Submission:", {
      name,
      email,
      company,
      message,
      timestamp: new Date().toISOString(),
    });

    // For now, just acknowledge the submission
    return NextResponse.json({
      success: true,
      message: "Thank you for your interest! Our team will contact you within 24 hours.",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to process contact form" },
      { status: 500 }
    );
  }
}
