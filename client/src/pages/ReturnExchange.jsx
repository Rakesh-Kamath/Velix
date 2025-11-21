import { useEffect } from 'react';
import Footer from '../components/Footer';

export default function ReturnExchange() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">Return & Exchange Policy</h1>

      <div className="space-y-8 text-gray-700 dark:text-gray-300">
        <section>
          <h2 className="text-2xl font-bold mb-4">30-Day Return Policy</h2>
          <p className="mb-4">
            We want you to be completely satisfied with your purchase. If you're not happy with your order, you can return or exchange it within 30 days of delivery.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Return Eligibility</h2>
          <p className="mb-4">To be eligible for a return or exchange, items must meet the following criteria:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Items must be unused and unworn</li>
            <li>Original packaging and tags must be intact</li>
            <li>Items must be returned within 30 days of delivery</li>
            <li>Proof of purchase (order confirmation or receipt) is required</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Non-Returnable Items</h2>
          <p className="mb-4">The following items cannot be returned or exchanged:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Items marked as final sale or clearance</li>
            <li>Used or worn products</li>
            <li>Items without original packaging or tags</li>
            <li>Custom or personalized items</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">How to Initiate a Return</h2>
          <ol className="list-decimal list-inside space-y-3">
            <li>
              <strong>Contact Us:</strong> Email support@velix.in with your order number and reason for return
            </li>
            <li>
              <strong>Receive Authorization:</strong> We'll send you a Return Authorization (RA) number and instructions
            </li>
            <li>
              <strong>Package Your Items:</strong> Securely pack the items with all original packaging and tags
            </li>
            <li>
              <strong>Ship Items:</strong> Send the package to the address provided in your RA email
            </li>
            <li>
              <strong>Refund Processing:</strong> Once we receive and inspect your return, we'll process your refund within 5-7 business days
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Exchanges</h2>
          <p className="mb-4">
            If you need a different size or color, we recommend returning the original item for a refund and placing a new order. This ensures you get the item you want as quickly as possible.
          </p>
          <p>
            For defective or damaged items, we'll gladly exchange them at no additional cost. Please contact us within 48 hours of delivery with photos of the defect or damage.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Return Shipping Costs</h2>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Standard Returns:</strong> Customer is responsible for return shipping costs</li>
            <li><strong>Defective/Wrong Items:</strong> We cover return shipping and send a prepaid label</li>
            <li><strong>Original Shipping:</strong> Original shipping charges are non-refundable (except for defective items)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Refund Method</h2>
          <p>
            Refunds will be issued to the original payment method used for the purchase. Please allow 5-10 business days for the refund to appear in your account after we process it.
          </p>
        </section>

        <section className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-3">Need Help?</h3>
          <p className="mb-2">
            If you have questions about returns or exchanges, our customer service team is here to help.
          </p>
          <p>
            <strong>Email:</strong> support@velix.in<br />
            <strong>Phone:</strong> +91 1800-XXX-XXXX
          </p>
        </section>
      </div>
    </div>
    <Footer />
    </>
  );
}
