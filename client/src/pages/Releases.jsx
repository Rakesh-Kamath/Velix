import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';

export default function Releases() {
  const [upcomingReleases, setUpcomingReleases] = useState([]);
  const [recentReleases, setRecentReleases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchReleases();
  }, []);

  const fetchReleases = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/products?sort=newest&limit=12');
      const products = data.products || data || [];
      setRecentReleases(products);
      // In a real app, you'd have a separate endpoint for upcoming releases
      setUpcomingReleases([]);
    } catch (error) {
      console.error('Error fetching releases:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Latest Releases</h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Stay updated with the newest drops and exclusive releases from top brands.
        </p>
      </div>

      {/* Upcoming Releases Section */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Coming Soon</h2>
        </div>
        
        {upcomingReleases.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-12 text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-semibold mb-2">No Upcoming Releases Yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Check back soon for exciting new drops and exclusive releases.
            </p>
            <Link 
              to="/products" 
              className="inline-block bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Shop Current Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {upcomingReleases.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Recent Releases Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Recent Releases</h2>
          <Link 
            to="/products?sort=newest" 
            className="text-sm font-semibold hover:underline"
          >
            View All →
          </Link>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : recentReleases.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No recent releases found
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recentReleases.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Newsletter Section */}
      <section className="mt-16 bg-black dark:bg-white text-white dark:text-black rounded-lg p-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Never Miss a Drop</h2>
        <p className="text-lg mb-8 opacity-90">
          Subscribe to our newsletter and be the first to know about upcoming releases and exclusive deals.
        </p>
        <div className="max-w-md mx-auto flex gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 rounded-lg bg-white dark:bg-black text-black dark:text-white border-2 border-white dark:border-black focus:outline-none"
          />
          <button className="px-8 py-3 bg-white dark:bg-black text-black dark:text-white rounded-lg font-semibold hover:opacity-90 transition-opacity">
            Subscribe
          </button>
        </div>
      </section>
    </div>
    <Footer />
    </>
  );
}
