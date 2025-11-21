import { useEffect } from 'react';
import Footer from '../components/Footer';

export default function AboutUs() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">About Velix</h1>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            Founded in 2020, Velix has become India's premier destination for authentic sneakers and street fashion accessories. 
            What started as a passion project by sneaker enthusiasts has grown into a trusted platform serving thousands of customers 
            across the country.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            We believe that everyone deserves access to genuine, high-quality footwear and accessories. Our mission is to bring 
            the latest releases and timeless classics directly to your doorstep, ensuring authenticity and quality with every purchase.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why Choose Velix?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">100% Authentic</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Every product sold on Velix is guaranteed authentic. We source directly from authorized distributors and brands.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Curated Selection</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Our team handpicks every item to ensure we offer only the best products from top brands worldwide.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Fast Delivery</h3>
              <p className="text-gray-700 dark:text-gray-300">
                With warehouses across India, we ensure quick and reliable delivery to your location.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Customer First</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Our dedicated support team is always ready to help you with any questions or concerns.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
          <ul className="space-y-3 text-gray-700 dark:text-gray-300">
            <li className="flex items-start">
              <span className="text-2xl mr-3">🎯</span>
              <div>
                <strong>Authenticity:</strong> We never compromise on product authenticity and quality.
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-2xl mr-3">🤝</span>
              <div>
                <strong>Trust:</strong> Building long-term relationships with our customers through transparency.
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-2xl mr-3">🚀</span>
              <div>
                <strong>Innovation:</strong> Constantly improving our platform to provide the best shopping experience.
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-2xl mr-3">🌍</span>
              <div>
                <strong>Community:</strong> Supporting sneaker culture and fashion communities across India.
              </div>
            </li>
          </ul>
        </section>

        <section className="bg-gray-50 dark:bg-gray-900 p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Join Our Journey</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            Whether you're a sneaker collector, fashion enthusiast, or someone looking for quality footwear, 
            Velix is your trusted partner. We're committed to growing with our community and bringing you the 
            best products, exclusive releases, and exceptional service.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Thank you for choosing Velix. Let's step into the future together.
          </p>
        </section>
      </div>
    </div>
    <Footer />
    </>
  );
}
