import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

export default function Brands() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const brands = [
    {
      name: 'Nike',
      description: 'Just Do It - Leading sportswear and athletic footwear brand',
      category: 'footwear',
      products: '150+ Products',
      image: 'https://via.placeholder.com/400x200/000000/FFFFFF?text=NIKE'
    },
    {
      name: 'Adidas',
      description: 'Impossible is Nothing - Performance and lifestyle footwear',
      category: 'footwear',
      products: '120+ Products',
      image: 'https://via.placeholder.com/400x200/000000/FFFFFF?text=ADIDAS'
    },
    {
      name: 'Puma',
      description: 'Forever Faster - Athletic and casual footwear',
      category: 'footwear',
      products: '80+ Products',
      image: 'https://via.placeholder.com/400x200/000000/FFFFFF?text=PUMA'
    },
    {
      name: 'Reebok',
      description: 'Be More Human - Sports and lifestyle footwear',
      category: 'footwear',
      products: '60+ Products',
      image: 'https://via.placeholder.com/400x200/000000/FFFFFF?text=REEBOK'
    },
    {
      name: 'Converse',
      description: 'All Star - Iconic canvas sneakers and lifestyle footwear',
      category: 'footwear',
      products: '50+ Products',
      image: 'https://via.placeholder.com/400x200/000000/FFFFFF?text=CONVERSE'
    },
    {
      name: 'New Balance',
      description: 'Fearlessly Independent - Premium running and lifestyle shoes',
      category: 'footwear',
      products: '70+ Products',
      image: 'https://via.placeholder.com/400x200/000000/FFFFFF?text=NEW+BALANCE'
    },
    {
      name: 'Asics',
      description: 'Sound Mind, Sound Body - Performance running footwear',
      category: 'footwear',
      products: '45+ Products',
      image: 'https://via.placeholder.com/400x200/000000/FFFFFF?text=ASICS'
    },
    {
      name: 'Happy Socks',
      description: 'Colorful Design - Premium socks and accessories',
      category: 'accessories',
      products: '30+ Products',
      image: 'https://via.placeholder.com/400x200/FF6B6B/FFFFFF?text=HAPPY+SOCKS'
    },
    {
      name: 'Gaston Luga',
      description: 'Scandinavian Design - Premium bags and backpacks',
      category: 'accessories',
      products: '25+ Products',
      image: 'https://via.placeholder.com/400x200/4ECDC4/FFFFFF?text=GASTON+LUGA'
    },
    {
      name: 'FDMTL',
      description: 'Japanese Craftsmanship - Designer accessories',
      category: 'accessories',
      products: '15+ Products',
      image: 'https://via.placeholder.com/400x200/95E1D3/000000?text=FDMTL'
    },
    {
      name: 'MM6',
      description: 'Maison Margiela - Contemporary fashion accessories',
      category: 'accessories',
      products: '20+ Products',
      image: 'https://via.placeholder.com/400x200/F38181/FFFFFF?text=MM6'
    }
  ];

  const footwearBrands = brands.filter(b => b.category === 'footwear');
  const accessoryBrands = brands.filter(b => b.category === 'accessories');

  return (
    <>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Our Brands</h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Explore our curated selection of premium brands from around the world.
        </p>
      </div>

      {/* Footwear Brands */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Footwear Brands</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {footwearBrands.map((brand, index) => (
            <Link
              key={index}
              to={`/products?brand=${encodeURIComponent(brand.name)}&category=footwear`}
              className="group border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="h-32 bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                <span className="text-3xl font-black text-gray-800 dark:text-gray-200">
                  {brand.name.toUpperCase()}
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 group-hover:underline">{brand.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{brand.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                    {brand.products}
                  </span>
                  <span className="text-sm font-semibold group-hover:underline">
                    Shop Now →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Accessory Brands */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Accessory Brands</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accessoryBrands.map((brand, index) => (
            <Link
              key={index}
              to={`/products?brand=${encodeURIComponent(brand.name)}&category=accessories`}
              className="group border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="h-32 bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                <span className="text-3xl font-black text-gray-800 dark:text-gray-200">
                  {brand.name.toUpperCase()}
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 group-hover:underline">{brand.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{brand.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                    {brand.products}
                  </span>
                  <span className="text-sm font-semibold group-hover:underline">
                    Shop Now →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Section */}
      <section className="bg-black dark:bg-white text-white dark:text-black rounded-lg p-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Authentic Products Only</h2>
        <p className="text-lg mb-8 opacity-90">
          All products are sourced directly from authorized brand distributors. 
          We guarantee 100% authenticity on every purchase.
        </p>
        <Link 
          to="/products" 
          className="inline-block bg-white dark:bg-black text-black dark:text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          Shop All Products
        </Link>
      </section>
    </div>
    <Footer />
    </>
  );
}
