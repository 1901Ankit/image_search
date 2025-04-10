import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Image as ImageIcon, Download, Plus, Circle, Square, Triangle } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import ImageEditor from './components/ImageEditor';
import SearchResults from './components/SearchResults';
import { searchImages } from './services/api';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast.error('Please enter a search term');
      return;
    }

    setLoading(true);
    try {
      const results = await searchImages(searchQuery);
      console.log(results);
      setImages(results);
    } catch (error) {
      toast.error('Failed to fetch images');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchDefaultImages = async () => {
      setLoading(true);

      const randomTopics = ['nature', 'technology', 'travel', 'abstract', 'animals', 'cars', 'mountains', 'food', 'space', 'architecture'];
      const randomQuery = randomTopics[Math.floor(Math.random() * randomTopics.length)];

      try {
        const defaultResults = await searchImages(randomQuery);
        console.log(defaultResults);
        setImages(defaultResults);
      } catch (error) {
        toast.error('Failed to load default images');
      } finally {
        setLoading(false);
      }
    };

    fetchDefaultImages();
  }, []);


  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-gray-900 flex items-center gap-2"
            >
              <ImageIcon className="w-8 h-8 text-blue-600" />
              Image Search and Edit
            </motion.h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {!selectedImage ? (
          <div className="space-y-8">
            {/* Search Form */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSearch}
              className="flex gap-4 max-w-2xl mx-auto"
            >
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for images..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                Search
              </button>
            </motion.form>
            <p className='text-center text-red-300'>Click any image of your choice and start editing!</p>
            <SearchResults
              images={images}
              loading={loading}
              onSelectImage={setSelectedImage}
            />
          </div>
        ) : (
          <ImageEditor image={selectedImage} onBack={() => setSelectedImage(null)} />
        )}
      </main>
    </div>
  );
}

export default App;