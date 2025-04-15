"use client";

import { Scale, Shield, Globe2, FileText, AlertTriangle, Link2, BookOpen, Ban, MessageSquare, RefreshCw } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-indigo-600 via-red-600 to-pink-500">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl text-white font-bold mb-6">Terms of Service</h1>
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
              Welcome to InformReaders.com. By accessing or using our website, you agree to comply 
              with and be bound by these Terms of Service. Please read them carefully before using our platform.
            </p>
          </div>

          {/* Key Points */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-gray-200 shadow-lg rounded-lg p-6 flex items-start gap-4">
              <Scale className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Legal Agreement</h3>
                <p className="text-sm text-muted-foreground">
                  These terms constitute a legally binding agreement between you and InformReaders.com
                </p>
              </div>
            </div>
            <div className="bg-gray-200 shadow-lg rounded-lg p-6 flex items-start gap-4">
              <Globe2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Global Service</h3>
                <p className="text-sm text-muted-foreground">
                  Operating across 150+ countries with region-specific content delivery
                </p>
              </div>
            </div>
            <div className="bg-gray-200 shadow-lg rounded-lg p-6 flex items-start gap-4">
              <Shield className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Data Protection</h3>
                <p className="text-sm text-muted-foreground">
                  Commitment to protecting user data and privacy
                </p>
              </div>
            </div>
            <div className="bg-gray-200 shadow-lg rounded-lg p-6 flex items-start gap-4">
              <RefreshCw className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Regular Updates</h3>
                <p className="text-sm text-muted-foreground">
                  Terms may be updated to reflect service improvements
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Sections */}
          <div className="space-y-12">
            {/* Use of Website */}
            <div className="bg-gray-200 shadow-lg rounded-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">Use of Website</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p>By using InformReaders.com, you agree to:</p>
                <ul className="space-y-3">
                  <li>• Use the service for lawful purposes only</li>
                  <li>• Not interfere with the website's functionality</li>
                  <li>• Respect other users' rights and privacy</li>
                  <li>• Not attempt to gain unauthorized access</li>
                  <li>• Comply with all applicable laws and regulations</li>
                </ul>
              </div>
            </div>

            {/* Intellectual Property */}
            <div className="bg-gray-200 shadow-lg rounded-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <FileText className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">Intellectual Property Rights</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p>All content on InformReaders.com is protected by copyright and intellectual property laws:</p>
                <ul className="space-y-3">
                  <li>• Text, graphics, and logos are our property</li>
                  <li>• Content may not be reproduced without permission</li>
                  <li>• Trademarks and brand features are protected</li>
                  <li>• User-submitted content remains your property</li>
                </ul>
              </div>
            </div>

            {/* Third Party Links */}
            <div className="bg-gray-200 shadow-lg rounded-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <Link2 className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">Third-Party Links & Content</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p>Our website may contain links to external sites and services:</p>
                <ul className="space-y-3">
                  <li>• We are not responsible for third-party content</li>
                  <li>• External links are provided for convenience</li>
                  <li>• Affiliate links may earn us commissions</li>
                  <li>• Users access external sites at their own risk</li>
                </ul>
              </div>
            </div>

            {/* Prohibited Activities */}
            <div className="bg-gray-200 shadow-lg rounded-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <Ban className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">Prohibited Activities</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p>The following activities are strictly prohibited:</p>
                <ul className="space-y-3">
                  <li>• Unauthorized data collection or scraping</li>
                  <li>• Distribution of malware or harmful code</li>
                  <li>• Impersonation of others or fraud</li>
                  <li>• Interference with service operation</li>
                  <li>• Violation of others' intellectual property rights</li>
                </ul>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-gray-200 shadow-lg rounded-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <AlertTriangle className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">Disclaimer & Limitations</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p>Important disclaimers about our service:</p>
                <ul className="space-y-3">
                  <li>• Service provided "as-is" without warranties</li>
                  <li>• No guarantee of continuous availability</li>
                  <li>• Not liable for data accuracy or completeness</li>
                  <li>• May modify or discontinue features</li>
                </ul>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-muted/30 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-semibold">Contact Us</h2>
              </div>
              <p className="text-muted-foreground">
                If you have any questions about our Terms of Service, please contact us at:
              </p>
              <p className="text-primary mt-2">legal@informreaders.com</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}