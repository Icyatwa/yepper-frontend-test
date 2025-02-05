import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import {
  PlusCircle,
  List,
  XCircle,
  ArrowLeft,
  Check,
  Tag,
  DollarSign,
  Info,
  X,
} from 'lucide-react';
import CategoriesComponents from './categoriesComponents';

// Custom Modal Component (remains the same)
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none"
      >
        <div 
          className="relative w-full max-w-md mx-4 my-6 z-50 animate-popIn"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative flex flex-col w-full bg-white rounded-xl shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 truncate">{title}</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            <div className="relative p-4 sm:p-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

function Categories() {
  const { websiteId } = useParams();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(false);
  const [result, setResult] = useState(true);
  const [selectedDescription, setSelectedDescription] = useState(null);

  const handleOpenForm = () => {
    setForm(true);
    setResult(false);
  };

  const handleCloseForm = () => {
    setForm(false);
    setResult(true);
  };

  const handleOpenDescription = (description) => {
    setSelectedDescription(description);
  };

  const handleCloseDescription = () => {
    setSelectedDescription(null);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`https://yepper-backend-test.onrender.com/api/ad-categories/${websiteId}`);

        if (response.data && response.data.categories) {
          setCategories(response.data.categories);
        } else {
          setError('No categories data received');
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (websiteId) {
      fetchCategories();
    } else {
      setError('No websiteId provided');
      setLoading(false);
    }
  }, [websiteId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded relative" role="alert">
        <strong className="font-bold block mb-1">Error: </strong>
        <span className="text-sm sm:text-base">{error}</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl">
        <div className="p-4 sm:p-6 bg-gray-100 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <Link 
            to="/projects" 
            className="text-sm sm:text-base text-gray-600 hover:text-blue-600 flex items-center"
          >
            <ArrowLeft className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
            Back to Projects
          </Link>
          <button 
            onClick={handleOpenForm} 
            className="flex items-center bg-[#ff6347] text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base"
          >
            <PlusCircle className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
            Add Categories
          </button>
        </div>

        {result && (
          <div className="p-4 sm:p-6">
            {categories.length === 0 ? (
              <div className="text-center text-gray-500 py-8 sm:py-10 flex flex-col items-center">
                <List className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mb-4" />
                <p className="text-sm sm:text-base">No categories found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {categories.map((category) => (
                  <div 
                    key={category._id} 
                    className="bg-white border border-gray-200 rounded-lg shadow-md p-3 sm:p-4 hover:shadow-lg transition-shadow relative"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h2 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center">
                        <Tag className="mr-2 w-4 h-4 sm:w-5 sm:h-5 text-[#6a1b9a]" />
                        {category.categoryName}
                      </h2>
                      <Check className="text-[#ff6347] w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="flex items-center text-gray-600 mb-2">
                      {category.description.length > 50 ? (
                        <>
                          <p className="truncate flex-grow text-sm sm:text-base">
                            {category.description.substring(0, 50)}...
                          </p>
                          <button 
                            onClick={() => handleOpenDescription(category.description)}
                            className="ml-2 text-[#6a1b9a] hover:text-blue-700"
                          >
                            <Info size={16} className="sm:w-5 sm:h-5" />
                          </button>
                        </>
                      ) : (
                        <p className="text-sm sm:text-base">{category.description}</p>
                      )}
                    </div>
                    <div className="flex items-center text-gray-700">
                      <DollarSign className="mr-2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                      <span className="font-bold text-sm sm:text-base">${category.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {form && (
          <div className='p-4 sm:p-6 space-y-4 sm:space-y-6'>
            <div className="flex justify-between items-center">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">Create Ad Categories</h2>
              <button 
                type="button"
                onClick={handleCloseForm} 
                className="text-gray-500 hover:text-red-500"
              >
                <XCircle className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            <div className='categories-box'>
              <CategoriesComponents />
            </div>
          </div>
        )}
      </div>

      {/* Custom Modal for Description */}
      <Modal 
        isOpen={!!selectedDescription} 
        onClose={handleCloseDescription}
        title="Full Description"
      >
        <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{selectedDescription}</p>
      </Modal>
    </div>
  );
}

export default Categories;