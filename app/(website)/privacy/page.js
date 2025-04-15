"use client";

import { Shield, Lock, Eye, FileText, Server, Bell, Globe2, ExternalLink } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-indigo-600 via-red-600 to-pink-500">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Privacy Policy</h1>
            <p className="text-lg text-white">
              Last updated: April 2024
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 ">
          {/* Introduction */}
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-muted-foreground leading-relaxed">
              At InformReaders.com, protecting your privacy is fundamental to our relationship with you. 
              This Privacy Policy outlines our practices for collecting, using, and safeguarding your 
              information when you use our website.
            </p>
          </div>

          {/* Key Privacy Points */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-gray-200 shadow-lg rounded-lg p-6 flex items-start gap-4">
              <Shield className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Data Protection</h3>
                <p className="text-sm text-muted-foreground">
                  We employ industry-standard security measures to protect your personal information
                </p>
              </div>
            </div>
            <div className="bg-gray-200 shadow-lg rounded-lg p-6 flex items-start gap-4">
              <Lock className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Secure Processing</h3>
                <p className="text-sm text-muted-foreground">
                  All data processing follows strict security protocols and compliance guidelines
                </p>
              </div>
            </div>
            <div className="bg-gray-200 shadow-lg rounded-lg p-6 flex items-start gap-4">
              <Eye className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Transparency</h3>
                <p className="text-sm text-muted-foreground">
                  Clear communication about how we collect and use your information
                </p>
              </div>
            </div>
            <div className="bg-gray-200 shadow-lg rounded-lg p-6 flex items-start gap-4">
              <Globe2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Global Standards</h3>
                <p className="text-sm text-muted-foreground">
                  Compliance with international privacy regulations and standards
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Sections */}
          <div className="space-y-12">
            {/* Information Collection */}
            <div className="bg-gray-200 shadow-lg rounded-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <FileText className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">Information We Collect</h2>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-3">Automatically Collected Information</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• IP address and location data</li>
                  <li>• Browser type and version</li>
                  <li>• Device information</li>
                  <li>• Operating system</li>
                  <li>• Pages visited and interaction data</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3 mt-6">Information You Provide</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Contact information (when submitted)</li>
                  <li>• Feedback and communications</li>
                  <li>• Survey responses (if participated)</li>
                  <li>• Account preferences</li>
                </ul>
              </div>
            </div>

            {/* Data Usage */}
            <div className="bg-gray-200 shadow-lg rounded-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <Server className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">How We Use Your Data</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p>We use the collected information for:</p>
                <ul className="space-y-3">
                  <li>• Personalizing your browsing experience</li>
                  <li>• Analyzing website traffic and usage patterns</li>
                  <li>• Improving our services and content</li>
                  <li>• Sending relevant notifications (with consent)</li>
                  <li>• Responding to your inquiries</li>
                  <li>• Ensuring website security</li>
                </ul>
              </div>
            </div>

            {/* Cookie Policy */}
            <div className="bg-gray-200 shadow-lg rounded-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <Bell className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">Cookie Policy</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  We use cookies and similar tracking technologies to enhance your browsing experience
                  and collect usage data. These include:
                </p>
                <ul className="space-y-3">
                  <li>• Essential cookies for website functionality</li>
                  <li>• Analytics cookies to understand usage patterns</li>
                  <li>• Preference cookies to remember your settings</li>
                  <li>• Marketing cookies for relevant content (optional)</li>
                </ul>
                <p className="mt-4">
                  You can modify your browser settings to decline cookies, although this may affect
                  some website features.
                </p>
              </div>
            </div>

            {/* Third Party Services */}
            <div className="bg-gray-200 shadow-lg rounded-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <ExternalLink className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">Third-Party Services</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Our website integrates with third-party services for various functionalities.
                  These services may collect data according to their own privacy policies:
                </p>
                <ul className="space-y-3">
                  <li>• Analytics providers</li>
                  <li>• Advertising networks</li>
                  <li>• Social media platforms</li>
                  <li>• Content delivery networks</li>
                </ul>
                <p className="mt-4">
                  We recommend reviewing the privacy policies of these third-party services
                  for more information about their data practices.
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-muted/30 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about our Privacy Policy or how we handle your data,
                please contact us at:
              </p>
              <p className="text-primary mt-2">privacy@informreaders.com</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}