import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer
      className="mt-16 border-t"
      style={{ backgroundColor: 'var(--footer-bg)', borderColor: 'var(--border-strong)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--footer-text)' }}>StarMart</h3>
            <p style={{ color: 'var(--footer-text-muted)' }}>
              Your trusted online marketplace for quality products and excellent service.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4" style={{ color: 'var(--footer-text)' }}>Quick Links</h4>
            <ul className="space-y-2" style={{ color: 'var(--footer-text-muted)' }}>
              <li>
                <Link href="/" className="transition" style={{ color: 'var(--footer-text-muted)' }}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="transition" style={{ color: 'var(--footer-text-muted)' }}>
                  Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="transition" style={{ color: 'var(--footer-text-muted)' }}>
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition" style={{ color: 'var(--footer-text-muted)' }}>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-4" style={{ color: 'var(--footer-text)' }}>Customer Service</h4>
            <ul className="space-y-2" style={{ color: 'var(--footer-text-muted)' }}>
              <li>
                <Link href="/faq" className="transition" style={{ color: 'var(--footer-text-muted)' }}>
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="transition" style={{ color: 'var(--footer-text-muted)' }}>
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="transition" style={{ color: 'var(--footer-text-muted)' }}>
                  Returns
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="transition" style={{ color: 'var(--footer-text-muted)' }}>
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4" style={{ color: 'var(--footer-text)' }}>Contact Us</h4>
            <ul className="space-y-3" style={{ color: 'var(--footer-text-muted)' }}>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+251 000 000 000</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>support@starmart.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1" />
                <span>Addis Ababa, Ethiopia</span>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="border-t pt-8 flex flex-col md:flex-row justify-between items-center"
          style={{ borderColor: 'var(--border-strong)' }}
        >
          <p className="text-sm" style={{ color: 'var(--footer-text-muted)' }}>
            &copy; 2026 StarMart. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="transition" style={{ color: 'var(--accent-primary)' }}>
              Facebook
            </a>
            <a href="#" className="transition" style={{ color: 'var(--accent-primary)' }}>
              Twitter
            </a>
            <a href="#" className="transition" style={{ color: 'var(--accent-primary)' }}>
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
