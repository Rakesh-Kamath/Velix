import { useEffect } from 'react';
import Footer from '../components/Footer';

export default function OrderShipping() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">Order & Shipping Information</h1>

      <div className="space-y-8 text-gray-700 dark:text-gray-300">
        <section>
          <h2 className="text-2xl font-bold mb-4">How to Place an Order</h2>
          <ol className="list-decimal list-inside space-y-3">
            <li>Browse our collection and add items to your cart</li>
            <li>Click the cart icon and review your items</li>
            <li>Proceed to checkout and enter your shipping information</li>
            <li>Select your preferred payment method</li>
            <li>Review your order and confirm purchase</li>
            <li>You'll receive an order confirmation email immediately</li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Processing Time</h2>
          <p className="mb-4">
            Orders are typically processed within 1-2 business days (Monday-Saturday, excluding public holidays). You'll receive a shipping confirmation email with tracking information once your order ships.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Shipping Options & Rates</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-900">
                  <th className="border border-gray-300 dark:border-gray-700 px-4 py-3 text-left">Shipping Method</th>
                  <th className="border border-gray-300 dark:border-gray-700 px-4 py-3 text-left">Delivery Time</th>
                  <th className="border border-gray-300 dark:border-gray-700 px-4 py-3 text-left">Cost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 dark:border-gray-700 px-4 py-3">Standard Shipping</td>
                  <td className="border border-gray-300 dark:border-gray-700 px-4 py-3">5-7 business days</td>
                  <td className="border border-gray-300 dark:border-gray-700 px-4 py-3">₹99 (Free on orders ≥ ₹2,999)</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 dark:border-gray-700 px-4 py-3">Express Shipping</td>
                  <td className="border border-gray-300 dark:border-gray-700 px-4 py-3">2-3 business days</td>
                  <td className="border border-gray-300 dark:border-gray-700 px-4 py-3">₹199</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 dark:border-gray-700 px-4 py-3">Same Day Delivery*</td>
                  <td className="border border-gray-300 dark:border-gray-700 px-4 py-3">Same day (select cities)</td>
                  <td className="border border-gray-300 dark:border-gray-700 px-4 py-3">₹299</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm mt-2">*Same day delivery available in select metro cities only</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Shipping Locations</h2>
          <p>
            We currently ship to all locations within India. International shipping is not available at this time but we're working on expanding our services globally.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Order Tracking</h2>
          <p className="mb-4">
            Track your order in two ways:
          </p>
          <ol className="list-decimal list-inside space-y-2">
            <li><strong>Email Link:</strong> Click the tracking link in your shipping confirmation email</li>
            <li><strong>Account Dashboard:</strong> Log into your account and view order status in "My Orders"</li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Delivery Requirements</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>A signature may be required for delivery</li>
            <li>Someone must be present to receive the package</li>
            <li>Valid ID may be requested by the courier</li>
            <li>Ensure your shipping address is complete and accurate</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Shipping Delays</h2>
          <p className="mb-4">
            While we strive for timely delivery, delays may occur due to:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>Weather conditions or natural disasters</li>
            <li>Public holidays and festivals</li>
            <li>Customs clearance (if applicable)</li>
            <li>Incorrect or incomplete shipping address</li>
            <li>Courier service issues</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Lost or Damaged Packages</h2>
          <p className="mb-4">
            If your package is lost or arrives damaged:
          </p>
          <ol className="list-decimal list-inside space-y-2">
            <li>Contact us within 48 hours of expected delivery (for lost packages) or actual delivery (for damaged items)</li>
            <li>Provide your order number and photos (for damaged items)</li>
            <li>We'll file a claim with the courier and send a replacement or issue a refund</li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Order Cancellation</h2>
          <p>
            You can cancel your order within 2 hours of placing it by contacting our support team. Once the order is shipped, it cannot be cancelled but can be returned according to our return policy.
          </p>
        </section>

        <section className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-3">Need Help with Your Order?</h3>
          <p className="mb-4">
            Our customer service team is ready to assist you with any shipping or order-related questions.
          </p>
          <p>
            <strong>Email:</strong> support@velix.in<br />
            <strong>Phone:</strong> +91 1800-XXX-XXXX<br />
            <strong>Hours:</strong> Monday - Saturday, 9:00 AM - 6:00 PM IST
          </p>
        </section>
      </div>
    </div>
    <Footer />
    </>
  );
}
