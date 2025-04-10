import React from 'react';
import { motion } from 'framer-motion';
import { Pencil } from 'lucide-react';

const SearchResults = ({ images, loading, onSelectImage }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (images.length === 0) {
    return null;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {images.map((image) => (
        <motion.div
          key={image.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          className="relative group rounded-lg overflow-hidden shadow-md bg-white"
        >
          <img
            src={image.urls.small}
            alt={image.alt_description}
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
            <button
              onClick={() => onSelectImage(image)}
              className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-white text-gray-900 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-100"
            >
              <Pencil className="w-4 h-4" />
              Edit Image
            </button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-sm p-2">
            <p className="truncate">{image.alt_description}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default SearchResults;