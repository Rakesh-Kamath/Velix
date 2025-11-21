import { useEffect } from 'react';
import Footer from '../components/Footer';

export default function HelpCenter() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">Help Center</h1>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-4">How can we help you?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Welcome to Velix Help Center. Here you'll find answers to common questions and guidance on how to get the most out of your shopping experience.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-bold mb-3">Popular Topics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 hover:border-black dark:hover:border-white transition-colors">
              <h4 className="font-bold mb-2">Order Tracking</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Track your order status and get delivery updates
              </p>
            </div>
            <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 hover:border-black dark:hover:border-white transition-colors">
              <h4 className="font-bold mb-2">Returns & Exchanges</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Learn about our return and exchange policy
              </p>
            </div>
            <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 hover:border-black dark:hover:border-white transition-colors">
              <h4 className="font-bold mb-2">Payment Methods</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                View accepted payment methods and payment issues
              </p>
            </div>
            <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 hover:border-black dark:hover:border-white transition-colors">
              <h4 className="font-bold mb-2">Account Management</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage your account settings and preferences
              </p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-bold mb-3">Contact Support</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Can't find what you're looking for? Our customer support team is here to help.
          </p>
          <div className="space-y-3">
            <p><strong>Email:</strong> support@velix.in</p>
            <p><strong>Phone:</strong> +91 1800-XXX-XXXX</p>
            <p><strong>Hours:</strong> Monday - Saturday, 9:00 AM - 6:00 PM IST</p>
          </div>
        </section>
      </div>
    </div>
    <Footer />
    </>
  );
}
