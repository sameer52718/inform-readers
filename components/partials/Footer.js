import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Github,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  Globe,
} from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-red-700 via-red-600 to-red-700 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-white text-lg font-semibold mb-4">About InformReaders</h3>
            <p className="text-sm leading-relaxed">
              Delivering comprehensive news and insights to our global audience. We strive to provide
              accurate, timely, and engaging content across various topics.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Categories</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/name-meaning" className="hover:text-white transition-colors flex items-center">
                    <ChevronRight className="h-4 w-4 mr-1" />
                    Baby Names
                  </Link>
                </li>
                <li>
                  <Link href="/postalcode" className="hover:text-white transition-colors flex items-center">
                    <ChevronRight className="h-4 w-4 mr-1" />
                    Postal Codes
                  </Link>
                </li>
                <li>
                  <Link href="/software" className="hover:text-white transition-colors flex items-center">
                    <ChevronRight className="h-4 w-4 mr-1" />
                    Software & Games
                  </Link>
                </li>
                <li>
                  <Link href="/swiftcode" className="hover:text-white transition-colors flex items-center">
                    <ChevronRight className="h-4 w-4 mr-1" />
                    Swift Codes
                  </Link>
                </li>
                <li>
                  <Link
                    href="/specification"
                    className="hover:text-white transition-colors flex items-center"
                  >
                    <ChevronRight className="h-4 w-4 mr-1" />
                    Specifications
                  </Link>
                </li>
                <li>
                  <Link href="/news" className="hover:text-white transition-colors flex items-center">
                    <ChevronRight className="h-4 w-4 mr-1" />
                    News
                  </Link>
                </li>
                <li>
                  <Link href="/travel" className="hover:text-white transition-colors flex items-center">
                    <ChevronRight className="h-4 w-4 mr-1" />
                    Travel
                  </Link>
                </li>
                <li>
                  <Link href="/biography" className="hover:text-white transition-colors flex items-center">
                    <ChevronRight className="h-4 w-4 mr-1" />
                    Biography
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors flex items-center">
                    <ChevronRight className="h-4 w-4 mr-1" />
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors flex items-center">
                    <ChevronRight className="h-4 w-4 mr-1" />
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors flex items-center">
                    <ChevronRight className="h-4 w-4 mr-1" />
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors flex items-center">
                    <ChevronRight className="h-4 w-4 mr-1" />
                    Terms of Use
                  </Link>
                </li>
                <li>
                  <Link href="/dcmapolicy" className="hover:text-white transition-colors flex items-center">
                    <ChevronRight className="h-4 w-4 mr-1" />
                    DMCA Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 mt-1" />
                <span>123 News Street, New York, NY 10001</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                <span>contact@informreaders.com</span>
              </li>
              <li className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                <span>www.informreaders.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-sm mb-4">Subscribe to our newsletter for daily updates and breaking news.</p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-2 text-black-500  rounded-md focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="w-full px-4 py-2  text-white rounded-md  transition-colors border border-white hover:bg-white hover:text-red-500"
              >
                Subscribe Now
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="md:flex md:items-center md:justify-between">
            <div className="text-sm">© {new Date().getFullYear()} InformReaders. All rights reserved.</div>
            <div className="mt-4 md:mt-0">
              <a href="https://thebytepulse.com" target="_blank" className="text-sm">
                Platform Develop By The Byte Pulse Software Company.
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
