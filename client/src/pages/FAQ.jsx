import { useState, useEffect } from 'react';
import Footer from '../components/Footer';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const faqs = [
    {
      question: "How do I place an order?",
      answer: "Browse our collection, add items to your cart, and proceed to checkout. You'll need to create an account or log in to complete your purchase."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, debit cards, UPI, net banking, and cash on delivery (COD) for eligible orders."
    },
    {
      question: "How long does shipping take?",
      answer: "Standard shipping typically takes 5-7 business days. Express shipping options are available at checkout for faster delivery (2-3 business days)."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy on most items. Products must be unused, unworn, and in their original packaging with all tags attached."
    },
    {
      question: "How do I track my order?",
      answer: "Once your order ships, you'll receive a tracking number via email. You can also track your order by logging into your account and viewing your order history."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Currently, we only ship within India. We're working on expanding our shipping to international locations soon."
    },
    {
      question: "How do I know my size?",
      answer: "Each product page includes a detailed size guide. We recommend measuring your feet and comparing with our size chart for the best fit."
    },
    {
      question: "Can I cancel or modify my order?",
      answer: "You can cancel or modify your order within 2 hours of placing it. After that, the order enters processing and cannot be changed. Please contact our support team immediately if you need assistance."
    },
    {
      question: "Are the products authentic?",
      answer: "Yes, all products sold on Velix are 100% authentic. We source directly from authorized distributors and brands."
    },
    {
      question: "What if I receive a defective product?",
      answer: "If you receive a defective or damaged product, please contact us within 48 hours of delivery with photos. We'll arrange for a replacement or full refund."
    }
  ];

  return (
    <>
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Find answers to common questions about shopping at Velix
      </p>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              <span className="font-bold">{faq.question}</span>
              <svg
                className={`w-5 h-5 transition-transform ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openIndex === index && (
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-300 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 p-6 bg-gray-100 dark:bg-gray-900 rounded-lg">
        <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Our customer support team is here to help you.
        </p>
        <p className="font-bold">Contact us at:</p>
        <p className="text-gray-600 dark:text-gray-400">
          nnm23cb004@nmamit.in<br />
          nnm23cb013@nmamit.in<br />
          nnm23cb038@nmamit.in
        </p>
      </div>
    </div>
    <Footer />
    </>
  );
}
