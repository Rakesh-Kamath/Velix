import { useEffect, useState } from 'react';
import Footer from '../components/Footer';

export default function StoreLocator() {
  const [selectedCity, setSelectedCity] = useState('all');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const stores = [
    {
      id: 1,
      name: 'Velix Mumbai - Bandra',
      city: 'mumbai',
      address: 'Shop 12, Linking Road, Bandra West, Mumbai - 400050',
      phone: '+91 98765-43211',
      hours: 'Mon-Sun: 11:00 AM - 9:00 PM',
      features: ['In-Store Pickup', 'Try Before Buy', 'Expert Staff']
    },
    {
      id: 2,
      name: 'Velix Mumbai - Colaba',
      city: 'mumbai',
      address: '45 Colaba Causeway, Colaba, Mumbai - 400001',
      phone: '+91 98765-43212',
      hours: 'Mon-Sun: 10:00 AM - 8:00 PM',
      features: ['In-Store Pickup', 'Sneaker Cleaning', 'Gift Wrapping']
    },
    {
      id: 3,
      name: 'Velix Delhi - Connaught Place',
      city: 'delhi',
      address: 'F Block, Inner Circle, Connaught Place, New Delhi - 110001',
      phone: '+91 98765-43213',
      hours: 'Mon-Sun: 11:00 AM - 9:00 PM',
      features: ['In-Store Pickup', 'Try Before Buy', 'Personal Styling']
    },
    {
      id: 4,
      name: 'Velix Bangalore - Indiranagar',
      city: 'bangalore',
      address: '100 Feet Road, Indiranagar, Bangalore - 560038',
      phone: '+91 98765-43214',
      hours: 'Mon-Sun: 11:00 AM - 9:00 PM',
      features: ['In-Store Pickup', 'Expert Staff', 'Exclusive Releases']
    },
    {
      id: 5,
      name: 'Velix Pune - Koregaon Park',
      city: 'pune',
      address: 'North Main Road, Koregaon Park, Pune - 411001',
      phone: '+91 98765-43215',
      hours: 'Mon-Sun: 11:00 AM - 8:30 PM',
      features: ['In-Store Pickup', 'Try Before Buy', 'Gift Wrapping']
    },
    {
      id: 6,
      name: 'Velix Chennai - T Nagar',
      city: 'chennai',
      address: 'Pondy Bazaar, T Nagar, Chennai - 600017',
      phone: '+91 98765-43216',
      hours: 'Mon-Sun: 10:00 AM - 9:00 PM',
      features: ['In-Store Pickup', 'Expert Staff', 'Sneaker Cleaning']
    }
  ];

  const cities = [
    { value: 'all', label: 'All Cities' },
    { value: 'mumbai', label: 'Mumbai' },
    { value: 'delhi', label: 'Delhi' },
    { value: 'bangalore', label: 'Bangalore' },
    { value: 'pune', label: 'Pune' },
    { value: 'chennai', label: 'Chennai' }
  ];

  const filteredStores = selectedCity === 'all' 
    ? stores 
    : stores.filter(store => store.city === selectedCity);

  return (
    <>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Store Locator</h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
          Find your nearest Velix store and experience our collection in person.
        </p>
        
        {/* City Filter */}
        <div className="flex items-center gap-4">
          <label className="font-semibold">Filter by City:</label>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
          >
            {cities.map(city => (
              <option key={city.value} value={city.value}>
                {city.label}
              </option>
            ))}
          </select>
          <span className="text-gray-600 dark:text-gray-400">
            {filteredStores.length} {filteredStores.length === 1 ? 'store' : 'stores'} found
          </span>
        </div>
      </div>

      {/* Stores Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {filteredStores.map(store => (
          <div 
            key={store.id} 
            className="border border-gray-300 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-bold mb-4">{store.name}</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-start">
                <svg className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gray-600 dark:text-gray-400 text-sm">{store.address}</span>
              </div>

              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-gray-600 dark:text-gray-400 text-sm">{store.phone}</span>
              </div>

              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-600 dark:text-gray-400 text-sm">{store.hours}</span>
              </div>
            </div>

            <div className="border-t border-gray-300 dark:border-gray-700 pt-4">
              <p className="text-xs font-semibold mb-2 text-gray-500 dark:text-gray-400">FEATURES</p>
              <div className="flex flex-wrap gap-2">
                {store.features.map((feature, index) => (
                  <span 
                    key={index}
                    className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            <button className="w-full mt-4 bg-black dark:bg-white text-white dark:text-black py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity">
              Get Directions
            </button>
          </div>
        ))}
      </div>

      {/* Info Section */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6">Store Services</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <div className="bg-black dark:bg-white text-white dark:text-black rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Try Before You Buy</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Visit our stores to try on products and get the perfect fit before making a purchase.
            </p>
          </div>

          <div>
            <div className="bg-black dark:bg-white text-white dark:text-black rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Click & Collect</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Order online and pick up from your nearest store at your convenience. No shipping fees!
            </p>
          </div>

          <div>
            <div className="bg-black dark:bg-white text-white dark:text-black rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Expert Assistance</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Our knowledgeable staff is here to help you find the perfect sneakers and accessories.
            </p>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}
