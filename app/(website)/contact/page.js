"use client";
import axiosInstance from "@/lib/axiosInstance";
import handleError from "@/lib/handleError";
import { Mail, Phone, MapPin, Clock, Send, AlertCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      // Simulate form submission
      setIsSubmitting(true);
      const { data } = await axiosInstance.post("/website/contact", formData);
      if (!data.error) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-600 via-red-600 to-pink-500 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white text-center">Contact Us</h1>
          <p className="mt-4 text-xl text-white text-center max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as
            possible.
          </p>
        </div>
      </div>

      {/* Contact Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              <p className="text-gray-600 mb-8">
                Whether you have a question about features, trials, pricing, or anything else, our team is
                ready to answer all your questions.
              </p>
            </div>

            {/* Contact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <Phone className="h-6 w-6 text-red-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone</h3>
                <p className="text-gray-600">Mon-Fri from 8am to 5pm</p>
                <a href="tel:+15551234567" className="text-red-600 hover:text-red-700 block mt-2">
                  +1 (555) 123-4567
                </a>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <Mail className="h-6 w-6 text-red-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
                <p className="text-gray-600">Our friendly team is here to help.</p>
                <a
                  href="mailto:contact@informreaders.com"
                  className="text-red-600 hover:text-red-700 block mt-2"
                >
                  contact@informreaders.com
                </a>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <MapPin className="h-6 w-6 text-red-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Office</h3>
                <p className="text-gray-600">Come say hello at our office.</p>
                <p className="text-gray-600 mt-2">123 News Street, New York, NY 10001</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <Clock className="h-6 w-6 text-red-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Working Hours</h3>
                <p className="text-gray-600">Monday - Friday</p>
                <p className="text-gray-600 mt-2">8:00 AM - 5:00 PM</p>
              </div>
            </div>

            {/* Map */}
            <div className="bg-gray-300 h-64 rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.11976397304603!3d40.697403442292485!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1645564944209!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  required
                ></textarea>
              </div>

              {status === "success" && (
                <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-center">
                  <AlertCircle className="h-5 w-5 text-green-500 mr-3" />
                  <p className="text-green-700">Message sent successfully!</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-red-600 text-white py-3 px-6 rounded-md hover:bg-red-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-70"
                disabled={isSubmitting}
              >
                <Send className="h-5 w-5" />
                <span>Send Message</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
