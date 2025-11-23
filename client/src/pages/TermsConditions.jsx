import { useEffect } from 'react';
import Footer from '../components/Footer';

export default function TermsConditions() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-4">Terms & Conditions</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Last updated: November 22, 2025
      </p>

      <div className="space-y-8 text-gray-700 dark:text-gray-300">
        <section>
          <h2 className="text-2xl font-bold mb-4">Agreement to Terms</h2>
          <p>
            By accessing and using the Velix website, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our website.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Use of Website</h2>
          <p className="mb-4">You agree to use our website only for lawful purposes and in a way that does not infringe upon the rights of others. You must not:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Use the website in any way that violates applicable laws or regulations</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Transmit any harmful code or malicious software</li>
            <li>Impersonate any person or entity</li>
            <li>Engage in any form of automated data collection without permission</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Account Registration</h2>
          <p className="mb-4">
            To make purchases, you must create an account. You are responsible for:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>Maintaining the confidentiality of your account credentials</li>
            <li>All activities that occur under your account</li>
            <li>Providing accurate and complete information</li>
            <li>Notifying us immediately of any unauthorized use</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Product Information</h2>
          <p>
            We strive to provide accurate product descriptions and images. However, we do not warrant that product descriptions, images, or other content are completely accurate, current, or error-free. Product colors may vary slightly due to display settings.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Pricing and Payment</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>All prices are listed in Indian Rupees (INR)</li>
            <li>Prices are subject to change without notice</li>
            <li>We reserve the right to cancel orders if pricing errors occur</li>
            <li>Payment must be completed at the time of purchase</li>
            <li>We accept credit/debit cards, UPI, net banking, and COD (where available)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Order Acceptance</h2>
          <p>
            All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order for any reason, including but not limited to product availability, errors in pricing or product information, or suspected fraud.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Shipping and Delivery</h2>
          <p className="mb-4">
            We ship within India. Delivery times are estimates and not guaranteed. We are not responsible for delays caused by shipping carriers or circumstances beyond our control.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Intellectual Property</h2>
          <p>
            All content on this website, including text, graphics, logos, images, and software, is the property of Velix or its content suppliers and is protected by copyright and intellectual property laws. You may not reproduce, distribute, or create derivative works without our written permission.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, Velix shall not be liable for any indirect, incidental, special, or consequential damages arising out of or related to your use of our website or products, even if we have been advised of the possibility of such damages.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Governing Law</h2>
          <p>
            These Terms and Conditions are governed by and construed in accordance with the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in [City], India.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting to the website. Your continued use of the website after changes are posted constitutes acceptance of the modified terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
          <p>
            For questions about these Terms and Conditions, please contact us at:
          </p>
          <p className="mt-4">
            <strong>Email:</strong><br />
            nnm23cb004@nmamit.in<br />
            nnm23cb013@nmamit.in<br />
            nnm23cb038@nmamit.in<br />
            <strong>Address:</strong><br />
            NMAM Institute of Technology<br />
            Nitte, Karkala Taluk<br />
            Udupi District, Karnataka 574110<br />
            India
          </p>
        </section>
      </div>
    </div>
    <Footer />
    </>
  );
}
