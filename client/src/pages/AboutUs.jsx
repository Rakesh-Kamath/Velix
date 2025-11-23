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
            Velix is a full-stack e-commerce platform developed as a collaborative project by three passionate 3rd year 
            Cyber Security students. This project represents our journey into modern web development, combining our knowledge 
            of security principles with cutting-edge web technologies.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Built from the ground up, Velix showcases a complete e-commerce solution featuring user authentication, product 
            management, shopping cart functionality, order processing, payment integration, and an intuitive admin dashboard. 
            Our focus was not just on functionality, but also on creating a secure, scalable, and user-friendly platform that 
            demonstrates best practices in full-stack development.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Meet the Developers</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg text-center">
              <div className="w-20 h-20 bg-black dark:bg-white rounded-full mx-auto mb-4 flex items-center justify-center text-white dark:text-black text-2xl font-bold">
                RK
              </div>
              <h3 className="text-xl font-semibold mb-2">Rakesh Kamath</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">3rd Year Cyber Security Student</p>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Full-stack developer specializing in backend architecture and database design.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg text-center">
              <div className="w-20 h-20 bg-black dark:bg-white rounded-full mx-auto mb-4 flex items-center justify-center text-white dark:text-black text-2xl font-bold">
                PR
              </div>
              <h3 className="text-xl font-semibold mb-2">Prajwal S Rao</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">3rd Year Cyber Security Student</p>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Full-stack developer focused on frontend development and user experience design.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg text-center">
              <div className="w-20 h-20 bg-black dark:bg-white rounded-full mx-auto mb-4 flex items-center justify-center text-white dark:text-black text-2xl font-bold">
                AB
              </div>
              <h3 className="text-xl font-semibold mb-2">Aditya Bhat K</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">3rd Year Cyber Security Student</p>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Full-stack developer with expertise in API integration and security implementation.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Project Overview</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
              <h3 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-300 dark:border-gray-700">Technology Stack</h3>
              <ul className="text-gray-700 dark:text-gray-300 space-y-2.5 text-sm">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-black dark:bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>Frontend:</strong> React.js, Tailwind CSS, React Router</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-black dark:bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>Backend:</strong> Node.js, Express.js</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-black dark:bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>Database:</strong> MongoDB with Mongoose</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-black dark:bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>Authentication:</strong> JWT, bcrypt</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-black dark:bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>Payment:</strong> Razorpay Integration</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-black dark:bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>AI Features:</strong> Google Generative AI (Chatbot)</span>
                </li>
              </ul>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
              <h3 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-300 dark:border-gray-700">Key Features</h3>
              <ul className="text-gray-700 dark:text-gray-300 space-y-2.5 text-sm">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-black dark:bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>User Authentication & Authorization</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-black dark:bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Product Catalog with Search & Filters</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-black dark:bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Shopping Cart & Wishlist</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-black dark:bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Order Management System</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-black dark:bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Payment Gateway Integration</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-black dark:bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Admin Dashboard</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-black dark:bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>AI-Powered Chatbot</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-black dark:bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Product Reviews & Ratings</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Our Approach</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Security First</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                As Cyber Security students, we've implemented robust security measures including input validation, 
                authentication, authorization, and secure payment processing.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Modern Development</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                Built using industry-standard technologies and best practices for scalable and maintainable code.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">User Experience</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                Focused on creating an intuitive, responsive, and visually appealing interface that works 
                seamlessly across all devices.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Collaboration</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                This project was a true team effort, with each member contributing their unique skills and 
                perspectives to create a cohesive final product.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 dark:bg-gray-900 p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Learning & Growth</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            This project has been an incredible learning experience for all three of us. From designing the database schema to 
            implementing complex features like payment processing and AI integration, we've gained hands-on experience in full-stack 
            development while applying our cybersecurity knowledge to ensure the platform is secure and reliable.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            We're proud of what we've built and excited to continue learning and improving. Thank you for exploring Velix!
          </p>
        </section>
      </div>
    </div>
    <Footer />
    </>
  );
}
