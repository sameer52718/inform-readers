"use client";

import { Globe2, Users, Shield, BookOpen, AlertCircle, Mail, Clock, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function AboutUs() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative py-20 bg-gradient-to-br from-indigo-600 via-red-600 to-pink-500">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                            Welcome to InformReaders.com
                        </h1>
                        <p className="text-xl text-white max-w-3xl mx-auto">
                            Your Ultimate Knowledge and Utility Hub Across 150+ Countries
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-16">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">Who We Are</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                InformReaders.com is a global platform designed to simplify your digital experience by providing
                                essential information, tools, and updates across multiple categories — all in one place. From the
                                latest mobile and gadget specifications to local baby names, postal codes, bank codes, job
                                listings, travel routes, gold and crypto rates, and more.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="p-6 bg-gray-200 rounded-lg shadow-lg">
                                <Globe2 className="h-8 w-8 mb-4 text-primary" />
                                <h3 className="font-semibold text-lg mb-2">Global Reach</h3>
                                <p className="text-sm text-muted-foreground">Serving users in over 150 countries</p>
                            </div>
                            <div className="p-6 bg-gray-200 rounded-lg shadow-lg">
                                <Shield className="h-8 w-8 mb-4 text-lg text-primary" />
                                <h3 className="font-semibold text-lg mb-2">Verified Data</h3>
                                <p className="text-sm text-muted-foreground">Ethical data scraping & verified sources</p>
                            </div>
                            <div className="p-6 bg-gray-200 rounded-lg shadow-lg">
                                <Users className="h-8 w-8 mb-4 text-primary" />
                                <h3 className="font-semibold text-lg mb-2">User-Centric</h3>
                                <p className="text-sm text-muted-foreground">Tailored for modern global readers</p>
                            </div>
                            <div className="p-6 bg-gray-200 rounded-lg shadow-lg">
                                <BookOpen className="h-8 w-8 mb-4 text-primary" />
                                <h3 className="font-semibold text-lg mb-2">Knowledge Hub</h3>
                                <p className="text-sm text-muted-foreground">Comprehensive information ecosystem</p>
                            </div>
                        </div>
                    </div>

                    {/* Mission & Vision */}
                    <div className=" rounded-2xl  mb-20">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-gray-200 rounded-lg p-6">
                                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                                <p className="text-muted-foreground">
                                    To empower individuals across the globe by delivering trustworthy, localized, and diverse
                                    information and tools in a simplified, accessible, and user-friendly manner.
                                </p>
                            </div>
                            <div className="bg-gray-200 rounded-lg p-6">
                                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                                <p className="text-muted-foreground">
                                    To become the world's leading multi-niche aggregator — bridging global knowledge and
                                    services for everyday users by combining smart automation, ethical data sourcing, and
                                    region-specific content delivery.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Privacy & Terms Section */}
                    <div className="space-y-12">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">Privacy & Terms</h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="bg-gray-200 rounded-lg p-6">
                                    <h3 className="text-xl font-semibold mb-4">Privacy Policy</h3>
                                    <p className="text-muted-foreground mb-4">
                                        At InformReaders.com, we value your privacy and are committed to protecting your personal
                                        data. We collect only necessary information to improve your experience while ensuring your
                                        data remains secure.
                                    </p>
                                    <Link href={"/privacy"} className="text-primary hover:underline">Read Full Privacy Policy →</Link>
                                </div>
                                <div className="bg-gray-200 rounded-lg p-6">
                                    <h3 className="text-xl font-semibold mb-4">Terms of Use</h3>
                                    <p className="text-muted-foreground mb-4">
                                        By using InformReaders.com, you agree to our terms of use which outline the rules,
                                        guidelines, and policies that govern your use of our platform and services.
                                    </p>
                                    <Link href={"/terms"} className="text-primary hover:underline">Read Full Terms →</Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-200 rounded-2xl p-8 mt-8">
                        <h2 className="text-3xl font-bold mb-8">Copyright Infringement / DMCA Policy</h2>
                        <p className="text-muted-foreground mb-8">
                            We respect the intellectual property rights of others. If you believe that any content on InformReaders.com violates your copyright, please follow the steps below to submit a DMCA notice.
                        </p>

                        <div className="grid md:grid-cols-2 gap-8 mb-8">
                            <div className="space-y-6">
                                <h3 className="text-xl font-semibold">How to Report a Violation</h3>
                                <div className="space-y-4">
                                    {[
                                        { icon: AlertCircle, text: "Identify the copyrighted work you believe is being infringed" },
                                        { icon: Mail, text: "Send a detailed DMCA notice to our designated email" },
                                        { icon: Clock, text: "Allow 15-30 days for our team to review and respond" },
                                        { icon: CheckCircle2, text: "We'll remove content if found to be infringing" }
                                    ].map((item, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <item.icon className="h-6 w-6 text-primary mt-1" />
                                            <p className="text-muted-foreground">{item.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-muted/50 rounded-lg p-6">
                                <h3 className="text-xl font-semibold mb-4">Required Information</h3>
                                <ul className="space-y-3 text-muted-foreground">
                                    <li>1. Your full name and contact information</li>
                                    <li>2. URLs of the copyrighted content</li>
                                    <li>3. URLs where the infringement occurs</li>
                                    <li>4. Statement of good faith belief</li>
                                    <li>5. Statement of accuracy under penalty of perjury</li>
                                    <li>6. Your electronic or physical signature</li>
                                </ul>
                                <div className="mt-6 p-4 bg-background rounded-lg">
                                    <p className="text-sm font-medium">Send DMCA notices to:</p>
                                    <p className="text-primary">dmca@informreaders.com</p>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        Subject Line: "DMCA Notice"
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-muted/30 rounded-lg p-6">
                            <p className="text-sm text-muted-foreground">
                                <strong>Important Note:</strong> We prefer to be contacted first before any legal action is initiated, and request a minimum of 15 days to review and respond to the complaint. False claims may result in legal consequences.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}