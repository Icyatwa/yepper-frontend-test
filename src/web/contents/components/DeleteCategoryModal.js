import React, { useState } from 'react';
import axios from 'axios';
import { 
    Trash2, 
    AlertTriangle,
    X 
} from 'lucide-react';
import { useClerk } from '@clerk/clerk-react';

const DeleteCategoryModal = ({ 
    categoryId, 
    onDeleteSuccess, 
    onCancel 
}) => {
    const { user } = useClerk();
    const userId = user?.id;
  
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState(null);
  
    const handleDeleteCategory = async () => {
        try {
          const response = await axios.delete(`http://localhost:5000/api/ad-categories/${categoryId}`, {
            data: { ownerId: userId }
          });
          
          // Handle successful deletion
          onDeleteSuccess();
        } catch (error) {
          if (error.response?.status === 400) {
            // Specific handling for ads preventing deletion
            const affectedAds = error.response.data.affectedAds;
            setError(`Cannot delete. ${affectedAds.length} active ads use this category.`);
          } else {
            setError('Failed to delete category');
          }
        }
      };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div 
                className="fixed inset-0 bg-black opacity-50" 
                onClick={onCancel}
            ></div>
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                            <Trash2 className="w-6 h-6 text-red-500" />
                            <h2 className="text-xl font-semibold">Delete Ad Category</h2>
                        </div>
                        <button 
                            onClick={onCancel} 
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <p className="text-gray-600 mb-6">
                        Are you sure you want to delete this ad category? 
                        This action cannot be undone.
                    </p>

                    {error && (
                        <div className="bg-red-50 border border-red-200 p-3 rounded-md flex items-center gap-2 mb-4">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onCancel}
                            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                            disabled={isDeleting}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDeleteCategory}
                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Deleting...' : 'Delete Category'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteCategoryModal;