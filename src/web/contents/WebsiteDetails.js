// WebsiteDetails.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
    Layout, 
    Globe, 
    X,
    ChevronDown,
    ExternalLink,
    DollarSign,
    Users,
    FileText,
    Code,
    AlertCircle,
    ArrowLeft,
    PlusCircle,
    Trash2,
    Edit,
    Check,
    Palette,
    Copy
} from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import CodeDisplay from './components/codeDisplay';
import CategoriesComponents from './categoriesComponents';
import LoadingSpinner from '../../components/LoadingSpinner'
import DeleteCategoryModal from './components/DeleteCategoryModal';
import AdCustomizationDocs from './AdCustomizationDocs';

const WebsiteDetails = () => {
    const navigate = useNavigate();
    const { websiteId } = useParams();
    const [result, setResult] = useState(true);
    const [website, setWebsite] = useState(null);
    const [categories, setCategories] = useState([]);
    const [expandedCategory, setExpandedCategory] = useState(null);
    const [categoriesForm, setCategoriesForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [isEditingWebsiteName, setIsEditingWebsiteName] = useState(false);
    const [tempWebsiteName, setTempWebsiteName] = useState('');
    const [editingUserCount, setEditingUserCount] = useState(null);
    const [newUserCount, setNewUserCount] = useState('');
    const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [selectedLanguage, setSelectedLanguage] = useState('english');
    const [activeTab, setActiveTab] = useState('spaces');
    const [copiedText, setCopiedText] = useState('');

    useEffect(() => {
        fetchWebsiteData();
    }, [websiteId]);

    // Available languages for selection
    const languages = [
        { value: 'english', label: 'English' },
        { value: 'french', label: 'French (Français)' },
        { value: 'kinyarwanda', label: 'Kinyarwanda' },
        { value: 'kiswahili', label: 'Swahili' },
        { value: 'chinese', label: 'Chinese (中文)' },
        { value: 'spanish', label: 'Spanish (Español)' }
    ];

    const fetchWebsiteData = async () => {
        setLoading(true);
        setFetchError(null);

        try {
            const websiteResponse = await axios.get(`http://localhost:5000/api/websites/website/${websiteId}`);
            const categoriesResponse = await axios.get(`http://localhost:5000/api/ad-categories/${websiteId}`);
            setWebsite(websiteResponse.data);
            setCategories(categoriesResponse.data.categories);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching website data:', error);
            setFetchError(error.message || 'Failed to load website data');
            setLoading(false);
        }
    };

    const handleUpdateWebsiteName = async () => {
        if (!tempWebsiteName.trim()) return;

        try {
            const response = await axios.patch(`http://localhost:5000/api/websites/${websiteId}/name`, {
                websiteName: tempWebsiteName.trim()
            });
            
            // Update local state
            setWebsite(prevWebsite => ({
                ...prevWebsite,
                websiteName: response.data.websiteName
            }));
            
            // Exit edit mode
            setIsEditingWebsiteName(false);
        } catch (error) {
            console.error('Error updating website name:', error);
            // Optionally show an error message
        }
    };

    const handleStartEditWebsiteName = () => {
        setTempWebsiteName(website.websiteName);
        setIsEditingWebsiteName(true);
    };

    const handleCancelEditWebsiteName = () => {
        setIsEditingWebsiteName(false);
    };
    
    const copyToClipboard = (text, label) => {
        navigator.clipboard.writeText(text);
        setCopiedText(label);
        setTimeout(() => setCopiedText(''), 2000);
    };
    
    const handleCategoryClick = (id) => {
        setExpandedCategory(expandedCategory === id ? null : id);
    };
    
    const CodeBlock = ({ code, label }) => (
        <div className="relative bg-gray-900 rounded-lg p-4 border border-gray-700">
            <button
                onClick={() => copyToClipboard(code, label)}
                className="absolute top-2 right-2 p-2 rounded bg-gray-800 hover:bg-gray-700 transition-colors"
            >
                {copiedText === label ? (
                    <Check size={16} className="text-green-400" />
                ) : (
                    <Copy size={16} className="text-gray-400" />
                )}
            </button>
            <pre className="text-sm text-gray-300 overflow-x-auto pr-12">
                <code>{code}</code>
            </pre>
        </div>
    );
    
    const customizations = [
    {
      title: "Change Colors",
      code: `
.yepper-ad-item {
    background: rgba(0, 100, 200, 0.25) !important;
}`,
      description: "Make ads blue"
    },
    {
      title: "Round Corners",
      code: `
.yepper-ad-item {
    border-radius: 20px !important;
}`,
      description: "Make ads more rounded"
    },
    {
      title: "Custom Button",
      code: `
.yepper-ad-cta {
    background: #ff6b6b !important;
    color: white !important;
}`,
      description: "Red button style"
    }
  ];

    const handleOpenCategoriesForm = () => {
        setCategoriesForm(true);
        setResult(false);
    };

    const handleUserCountEdit = (category) => {
        setEditingUserCount(category._id);
        setNewUserCount(category.userCount.toString());
    };

    const handleUserCountSave = async (categoryId) => {
        try {
            const parsedCount = parseInt(newUserCount, 10);
            
            // Validate input
            if (isNaN(parsedCount) || parsedCount < 0) {
                toast.error('Please enter a valid positive number');
                return;
            }

            // Call backend to reset user count
            const response = await axios.put(`http://localhost:5000/api/ad-categories/${categoryId}/reset-user-count`, {
                newUserCount: parsedCount
            });

            // Update local state
            const updatedCategories = categories.map(cat => 
                cat._id === categoryId 
                    ? { ...cat, userCount: response.data.category.userCount } 
                    : cat
            );
            setCategories(updatedCategories);

            // Reset editing state
            setEditingUserCount(null);
            setNewUserCount('');

            toast.success('User count updated successfully');
        } catch (error) {
            console.error('Error updating user count:', error);
            
            const errorMessage = error.response?.data?.message || 'Failed to update user count';
            toast.error(errorMessage);
        }
    };

    const handleCloseCategoriesForm = () => {
        setCategoriesForm(false);
        setResult(true);
        fetchWebsiteData();
    };

    const handleDeleteCategory = (category) => {
        setCategoryToDelete(category);
    };

    const handleDeleteSuccess = () => {
        // Close the delete modal
        setCategoryToDelete(null);
        // Refresh the website data
        fetchWebsiteData();
    };

    const handleOpenLanguageModal = (category) => {
        setCurrentCategory(category);
        setSelectedLanguage(category.defaultLanguage || 'english');
        setIsLanguageModalOpen(true);
    };

    const handleSaveLanguage = async () => {
        if (!currentCategory) return;
        
        try {
            const response = await axios.patch(
                `http://localhost:5000/api/ad-categories/category/${currentCategory._id}/language`,
                { defaultLanguage: selectedLanguage }
            );
            
            // Update the local state with the new data
            setCategories(categories.map(cat => 
                cat._id === currentCategory._id 
                    ? { ...cat, defaultLanguage: selectedLanguage } 
                    : cat
            ));
            
            // Close the modal
            setIsLanguageModalOpen(false);
            setCurrentCategory(null);
            
            // Optional: Show success message
            toast.success('Default language updated successfully!');
        } catch (error) {
            console.error('Error updating language:', error);
            toast.error('Failed to update default language');
        }
    };

    if (loading) {
        return (
            <LoadingSpinner />
        );
    }

    if (fetchError) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="max-w-md w-full backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl overflow-hidden p-8">
                    <div className="flex flex-col items-center">
                        <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
                        <h2 className="text-xl font-bold mb-2">Failed to Load Data</h2>
                        <p className="text-white/70 mb-6 text-center">{fetchError}</p>
                        <button 
                            onClick={fetchWebsiteData}
                            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium transition-all duration-300 hover:from-blue-500 hover:to-indigo-500"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Ultra-modern header with blur effect */}
            <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/20 border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="flex items-center text-white/70 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={18} className="mr-2" />
                        <span className="font-medium tracking-wide">BACK</span>
                    </button>
                    <div className="bg-white/10 px-4 py-1 rounded-full text-xs font-medium tracking-widest">WEBSITE DETAILS</div>
                </div>
            </header>

            <Toaster 
                position="top-right" 
                reverseOrder={false} 
                containerStyle={{ zIndex: 9999 }}
            />
            
            {result && (
                <main className="max-w-7xl mx-auto px-6 py-12">
                    {/* Website Title Section */}
                    <div className="mb-16">
                        <div className="flex items-center justify-center mb-6">
                            <div className="h-px w-12 bg-blue-500 mr-6"></div>
                            <span className="text-blue-400 text-sm font-medium uppercase tracking-widest">Website Manager</span>
                            <div className="h-px w-12 bg-blue-500 ml-6"></div>
                        </div>
                        
                        <h1 className="text-center text-5xl font-bold mb-6 tracking-tight">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                                {isEditingWebsiteName ? (
                                    <div className="flex items-center gap-2">
                                        <input 
                                            type="text"
                                            value={tempWebsiteName}
                                            onChange={(e) => setTempWebsiteName(e.target.value)}
                                            className="text-3xl font-bold text-blue-950 w-full px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            autoFocus
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') handleUpdateWebsiteName();
                                                if (e.key === 'Escape') handleCancelEditWebsiteName();
                                            }}
                                        />
                                        <button 
                                            onClick={handleUpdateWebsiteName}
                                            className="text-green-500 hover:bg-green-100 p-2 rounded-full"
                                            aria-label="Save website name"
                                        >
                                            <Check className="w-6 h-6" />
                                        </button>
                                        <button 
                                            onClick={handleCancelEditWebsiteName}
                                            className="text-red-500 hover:bg-red-100 p-2 rounded-full"
                                            aria-label="Cancel editing"
                                        >
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>
                                ) : (
                                    <div 
                                        className="flex items-center gap-2 group cursor-pointer"
                                        onClick={handleStartEditWebsiteName}
                                    >
                                        <span className="text-3xl text-center font-bold mb-2 text-blue-950">
                                            {website?.websiteName}
                                        </span>
                                        <Edit 
                                            className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" 
                                        />
                                    </div>
                                )}
                            </span>
                        </h1>
                        
                        {website?.websiteLink && (
                            <div className="flex justify-center mb-8">
                                <a 
                                    href={website.websiteLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center space-x-2 text-white/70 hover:text-blue-400 transition-colors"
                                >
                                    <Globe className="w-5 h-5" />
                                    <span>{website.websiteLink}</span>
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>
                        )}

                        {/* Tabs */}
                        <div className="flex justify-center mb-12">
                            <div className="bg-white/5 p-1 rounded-xl border border-white/10">
                                <button
                                    onClick={() => setActiveTab('spaces')}
                                    className={`px-6 py-3 rounded-lg font-medium transition-all ${
                                    activeTab === 'spaces' 
                                        ? 'bg-blue-600 text-white' 
                                        : 'text-white/70 hover:text-white'
                                    }`}
                                >
                                    <Layout className="w-4 h-4 inline mr-2" />
                                    Ad Spaces
                                </button>
                                <button
                                    onClick={() => setActiveTab('customize')}
                                    className={`px-6 py-3 rounded-lg font-medium transition-all ${
                                    activeTab === 'customize' 
                                        ? 'bg-blue-600 text-white' 
                                        : 'text-white/70 hover:text-white'
                                    }`}
                                >
                                    <Palette className="w-4 h-4 inline mr-2" />
                                    Customize Ads
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    {/* Add Space Button */}
                    {activeTab === 'spaces' && (
                        <div>
                            <div className="flex justify-center mb-12">
                                <button
                                    onClick={handleOpenCategoriesForm}
                                    className="group relative h-14 px-8 rounded-xl bg-gradient-to-r from-orange-600 to-rose-600 text-white font-medium overflow-hidden transition-all duration-300"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-rose-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <span className="relative z-10 flex items-center justify-center">
                                        <PlusCircle size={16} className="mr-2" />
                                        <span className="uppercase tracking-wider">Add New Ad Space</span>
                                    </span>
                                </button>
                            </div>

                            {/* Website Spaces */}
                            <div className="mb-12">
                                <h2 className="flex items-center text-2xl font-bold mb-8">
                                    <Layout className="w-6 h-6 text-orange-400 mr-3" />
                                    <span className="text-white">Ad Spaces</span>
                                    <span className="ml-3 text-lg px-2 py-0.5 rounded-full bg-white/10">{categories.length}</span>
                                </h2>
                                
                                {categories.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {categories.map((category) => (
                                            <div 
                                                key={category._id}
                                                className={`backdrop-blur-md overflow-hidden border border-white/10 transition-all duration-500${
                                                    expandedCategory === category._id 
                                                    ? 'bg-gradient-to-b from-blue-900/40 to-blue-900/20' 
                                                    : 'bg-gradient-to-b from-gray-900/40 to-gray-900/20'
                                                }`}
                                                style={{
                                                    boxShadow: expandedCategory === category._id 
                                                        ? '0 0 40px rgba(59, 130, 246, 0.3)' 
                                                        : '0 0 0 rgba(0, 0, 0, 0)'
                                                }}
                                            >
                                                {/* Web Space Header */}
                                                <div 
                                                    className="p-8 cursor-pointer"
                                                    onClick={() => handleCategoryClick(category._id)}
                                                >
                                                    <div className="flex items-center mb-6">
                                                        <div className="relative">
                                                            <div className="absolute inset-0 rounded-full bg-orange-500 blur-md opacity-40"></div>
                                                            <div className="relative p-3 rounded-full bg-gradient-to-r from-orange-600 to-orange-400">
                                                                <Layout className="w-10 h-10 text-white" size={24} />
                                                            </div>
                                                        </div>
                                                        <div className="ml-4 flex-1">
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <div className="uppercase text-xs font-semibold text-blue-400 tracking-widest mb-1">
                                                                        {category.spaceType}
                                                                    </div>
                                                                    <h3 className="text-2xl font-bold">{category.categoryName}</h3>
                                                                </div>
                                                                <div 
                                                                    className={`p-2 rounded-full bg-white/5 transition-transform duration-300 ${
                                                                        expandedCategory === category._id ? 'rotate-180 bg-blue-500/20' : ''
                                                                    }`}
                                                                >
                                                                    <ChevronDown className="w-5 h-5 text-white" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Metrics */}
                                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                                        <div className="backdrop-blur-sm bg-white/5 rounded-xl p-4 flex items-center">
                                                            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                                                                <DollarSign size={20} className="text-blue-400" />
                                                            </div>
                                                            <div>
                                                                <p className="text-white/70 text-sm">Price</p>
                                                                <p className="text-xl font-bold">${category.price}</p>
                                                            </div>
                                                        </div>
                                                        <div className="backdrop-blur-sm bg-white/5 rounded-xl p-4 flex items-center">
                                                            

                                                            {editingUserCount === category._id ? (
                                                                <div className="flex items-center gap-2">
                                                                    <input 
                                                                        type="number" 
                                                                        value={newUserCount}
                                                                        onChange={(e) => setNewUserCount(e.target.value)}
                                                                        onKeyDown={(e) => {
                                                                            if (e.key === 'Enter') {
                                                                                handleUserCountSave(category._id);
                                                                            } else if (e.key === 'Escape') {
                                                                                setEditingUserCount(null);
                                                                                setNewUserCount('');
                                                                            }
                                                                        }}
                                                                        className="w-20 px-2 py-1 text-blue-900 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                        autoFocus
                                                                    />
                                                                    <div className="flex gap-1">
                                                                        <button 
                                                                            onClick={() => handleUserCountSave(category._id)}
                                                                            className="text-green-500 hover:bg-green-100 p-1 rounded-full"
                                                                            aria-label="Save user count"
                                                                        >
                                                                            <Check className="w-5 h-5" />
                                                                        </button>
                                                                        <button 
                                                                            onClick={() => {
                                                                                setEditingUserCount(null);
                                                                                setNewUserCount('');
                                                                            }}
                                                                            className="text-red-500 hover:bg-red-100 p-1 rounded-full"
                                                                            aria-label="Cancel editing"
                                                                        >
                                                                            <X className="w-5 h-5" />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="backdrop-blur-sm bg-white/5 rounded-xl p-4 flex items-center"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleUserCountEdit(category)
                                                                    }}
                                                                >
                                                                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                                                                        <Users size={20} className="text-purple-400" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-white/70 text-sm">Users</p>
                                                                        <p className="text-xl font-bold">{category.userCount}</p>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div 
                                                            className="backdrop-blur-sm bg-white/5 rounded-xl p-4 flex items-center cursor-pointer hover:bg-white/10 transition-colors"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleOpenLanguageModal(category);
                                                            }}
                                                        >
                                                            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                                                                <Globe size={20} className="text-green-400" />
                                                            </div>
                                                            <div>
                                                                <p className="text-white/70 text-sm">Language</p>
                                                                <p className="text-xl font-bold capitalize">
                                                                    {category.defaultLanguage || 'English'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* {isLanguageModalOpen && currentCategory && (
                                                    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
                                                        <div 
                                                            className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-xl border border-white/10 p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <h3 className="text-2xl font-bold mb-4">Set Default Language</h3>
                                                            <p className="text-white/70 mb-4">
                                                                Choose the default language for the "Available Advertising Space" box on your website.
                                                                Visitors will still be able to switch languages, but this will be the initial language shown.
                                                            </p>
                                                            
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                                                                {languages.map(lang => (
                                                                    <div 
                                                                        key={lang.value}
                                                                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                                                                            selectedLanguage === lang.value
                                                                                ? 'border-blue-500 bg-blue-500/20'
                                                                                : 'border-white/10 hover:border-white/30'
                                                                        }`}
                                                                        onClick={() => setSelectedLanguage(lang.value)}
                                                                    >
                                                                        <div className="flex items-center">
                                                                            {selectedLanguage === lang.value && (
                                                                                <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center mr-2">
                                                                                    <Check size={12} className="text-white" />
                                                                                </div>
                                                                            )}
                                                                            <span className="font-medium">{lang.label}</span>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            
                                                            <div className="flex justify-end gap-3">
                                                                <button
                                                                    onClick={() => setIsLanguageModalOpen(false)}
                                                                    className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition-colors"
                                                                >
                                                                    Cancel
                                                                </button>
                                                                <button
                                                                    onClick={handleSaveLanguage}
                                                                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors"
                                                                >
                                                                    Save
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )} */}
                                                
                                                {isLanguageModalOpen && currentCategory && (
                                                    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 overflow-hidden p-3">
                                                        <div 
                                                            className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-xl border border-white/10 w-full max-w-md max-h-[80vh] flex flex-col"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            {/* Header */}
                                                            <div className="p-4 border-b border-white/10">
                                                                <h3 className="text-xl font-bold">Set Default Language</h3>
                                                                <p className="text-white/70 text-sm mt-1">
                                                                    Choose the default language for your ad space.
                                                                </p>
                                                            </div>
                                                            
                                                            {/* Scrollable Body */}
                                                            <div className="p-4 overflow-y-auto flex-1">
                                                                <div className="grid grid-cols-2 gap-2">
                                                                    {languages.map(lang => (
                                                                        <div 
                                                                            key={lang.value}
                                                                            className={`p-2 text-sm rounded-lg border cursor-pointer transition-all ${
                                                                                selectedLanguage === lang.value
                                                                                    ? 'border-blue-500 bg-blue-500/20'
                                                                                    : 'border-white/10 hover:border-white/30'
                                                                            }`}
                                                                            onClick={() => setSelectedLanguage(lang.value)}
                                                                        >
                                                                            <div className="flex items-center">
                                                                                {selectedLanguage === lang.value && (
                                                                                    <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center mr-2">
                                                                                        <Check size={10} className="text-white" />
                                                                                    </div>
                                                                                )}
                                                                                <span>{lang.label}</span>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            
                                                            {/* Footer */}
                                                            <div className="p-4 border-t border-white/10 flex justify-end gap-2">
                                                                <button
                                                                    onClick={() => setIsLanguageModalOpen(false)}
                                                                    className="px-3 py-1.5 text-sm rounded-lg border border-white/20 hover:bg-white/10 transition-colors"
                                                                >
                                                                    Cancel
                                                                </button>
                                                                <button
                                                                    onClick={handleSaveLanguage}
                                                                    className="px-3 py-1.5 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors"
                                                                >
                                                                    Save
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {expandedCategory === category._id && (
                                                    <>
                                                        <div className="px-8 pb-8 pt-2 border-t border-white/10 bg-black/20">
                                                            {category.instructions && (
                                                                <div className="mb-6">
                                                                    <h4 className="text-sm uppercase tracking-wider text-blue-400 font-medium mb-3 flex items-center">
                                                                        <FileText className="w-4 h-4 mr-2" />
                                                                        Instructions
                                                                    </h4>
                                                                    <div className="backdrop-blur-sm bg-white/5 rounded-xl p-4 border border-white/10">
                                                                        <p className="text-white/80">
                                                                            {category.instructions}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            
                                                            <div>
                                                                <h4 className="text-sm uppercase tracking-wider text-blue-400 font-medium mb-3 flex items-center">
                                                                    <Code className="w-4 h-4 mr-2" />
                                                                    Integration Code
                                                                </h4>
                                                                <div className="mt-2">
                                                                    <CodeDisplay codes={category.apiCodes} />
                                                                </div>
                                                            </div>
                                                            
                                                        </div>
                                                        <div className="flex p-5">
                                                            {/* Delete button added */}
                                                            <button 
                                                                onClick={(e) => {
                                                                    e.stopPropagation(); 
                                                                    handleDeleteCategory(category);
                                                                }}
                                                                className="flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
                                                                aria-label="Delete Category"
                                                            >
                                                                <Trash2 className="w-5 h-5" />
                                                                <span>Delete Space</span>
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                ) : (
                                    <div className="backdrop-blur-md bg-white/5 rounded-3xl border border-white/10 p-12 text-center">
                                        <div className="relative mx-auto w-20 h-20 mb-6">
                                            <div className="absolute inset-0 rounded-full bg-orange-500 blur-md opacity-40"></div>
                                            <div className="relative h-full w-full rounded-full bg-gradient-to-r from-orange-600 to-orange-400 flex items-center justify-center">
                                                <Layout className="w-10 h-10 text-white" />
                                            </div>
                                        </div>
                                        <h3 className="text-2xl font-bold mb-3">No Ad Spaces Yet</h3>
                                        <p className="text-white/70 mb-8 max-w-md mx-auto">
                                            Create your first ad space to start monetizing your website with targeted advertisements.
                                        </p>
                                        <button
                                            onClick={handleOpenCategoriesForm}
                                            className="group relative h-12 px-6 rounded-xl bg-gradient-to-r from-orange-600 to-rose-600 text-white font-medium overflow-hidden transition-all duration-300"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-rose-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            <span className="relative z-10 flex items-center justify-center">
                                                <PlusCircle size={16} className="mr-2" />
                                                <span className="uppercase tracking-wider">Create First Ad Space</span>
                                            </span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Customize Tab */}
                    {activeTab === 'customize' && (
                        <div>
                            {/* Simple Introduction */}
                            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 mb-8">
                                <h2 className="text-2xl font-bold mb-4 flex items-center">
                                    <Palette className="w-6 h-6 mr-3 text-purple-400" />
                                    Customize Your Ads
                                </h2>
                                <p className="text-gray-300 mb-4">
                                    Copy any code below and add it to your website's CSS to change how your ads look.
                                </p>
                                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                                    <p className="text-blue-200 text-sm">
                                        <strong>Tip:</strong> Always add <code className="bg-black/30 px-1 rounded">!important</code> to make sure your styles work.
                                    </p>
                                </div>
                            </div>
                
                            {/* Simple Examples */}
                            <div className="space-y-6">
                                {customizations.map((example, index) => (
                                    <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
                                        <div className="p-6">
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="text-xl font-semibold">{example.title}</h3>
                                                <span className="text-sm text-gray-400">{example.description}</span>
                                            </div>
                                            <CodeBlock code={example.code} label={example.title} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                
                            {/* How to Use */}
                            <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-sm rounded-xl p-6 border border-white/10 mt-8">
                                <h3 className="text-xl font-bold mb-4 flex items-center">
                                    <Code className="w-5 h-5 mr-2 text-purple-400" />
                                    How to Use This Code
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold mb-2">Method 1: Add to your CSS file</h4>
                                        <CodeBlock 
                                        code={`
/* Paste the code in your main CSS file */
.yepper-ad-item {
    /* Your custom styles here */
}`}
                                        label="css-method"
                                        />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-2">Method 2: Add to your HTML</h4>
                                        <CodeBlock 
                                        code={`
<style>
    /* Paste the code here */
    .yepper-ad-item {
        /* Your custom styles here */
    }
</style>
                                        `}
                                        label="html-method"
                                        />
                                    </div>
                                </div>
                            </div>
                
                            {/* Ad HTML Structure */}
                            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 mt-8">
                                <h3 className="text-xl font-bold mb-4">How Your Ad HTML Looks</h3>
                                <p className="text-gray-300 mb-4">This is the basic structure of your ads. Use these class names to style them:</p>
                                <CodeBlock 
                                code={`
<div class="yepper-ad-wrapper">
    <div class="yepper-ad-container">
        <div class="yepper-ad-item">
            
            <!-- Top section -->
            <div class="yepper-ad-header">
                <span class="yepper-ad-header-logo">Ad by Yepper</span>
                <span class="yepper-ad-header-badge">Sponsored</span>
            </div>
            
            <!-- Main content -->
            <div class="yepper-ad-content">
                <div class="yepper-ad-image-wrapper">
                    <img class="yepper-ad-image" src="ad-image.jpg" alt="Ad">
                </div>
                <h3 class="yepper-ad-business-name">Business Name</h3>
                <p class="yepper-ad-description">Ad description text</p>
                <button class="yepper-ad-cta">Click Here</button>
            </div>
            
            <!-- Bottom section -->
            <div class="yepper-ad-footer">
                <span class="yepper-ad-footer-brand">Powered by Yepper</span>
                <span class="yepper-ad-footer-business">Business Info</span>
            </div>
            
        </div>
    </div>
</div>
                                `}
                                label="ad-html-structure"
                            />
                            </div>
                
                            {/* Common Classes */}
                            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 mt-8">
                                <h3 className="text-xl font-bold mb-4">Classes You Can Style</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { class: '.yepper-ad-wrapper', desc: 'Outer wrapper container' },
                                        { class: '.yepper-ad-container', desc: 'Inner container' },
                                        { class: '.yepper-ad-item', desc: 'Main ad card' },
                                        { class: '.yepper-ad-header', desc: 'Top section ("Ad by Yepper")' },
                                        { class: '.yepper-ad-header-logo', desc: 'Yepper branding text' },
                                        { class: '.yepper-ad-header-badge', desc: 'Sponsored badge' },
                                        { class: '.yepper-ad-content', desc: 'Main content area' },
                                        { class: '.yepper-ad-image-wrapper', desc: 'Image container' },
                                        { class: '.yepper-ad-image', desc: 'The actual ad image' },
                                        { class: '.yepper-ad-business-name', desc: 'Business title (h3)' },
                                        { class: '.yepper-ad-description', desc: 'Ad description text (p)' },
                                        { class: '.yepper-ad-cta', desc: 'Click button' },
                                        { class: '.yepper-ad-footer', desc: 'Bottom section' },
                                        { class: '.yepper-ad-footer-brand', desc: 'Powered by Yepper text' },
                                        { class: '.yepper-ad-footer-business', desc: 'Business info text' }
                                    ].map((item, index) => (
                                        <div key={index} className="bg-black/30 rounded-lg p-3 border border-white/10">
                                            <div className="flex items-center justify-between">
                                                <code className="text-green-400 font-mono text-sm">{item.class}</code>
                                                <button
                                                    onClick={() => copyToClipboard(item.class, item.class)}
                                                    className="p-1 rounded hover:bg-white/10 transition-colors"
                                                >
                                                    {copiedText === item.class ? (
                                                        <Check size={14} className="text-green-400" />
                                                    ) : (
                                                        <Copy size={14} className="text-gray-400" />
                                                    )}
                                                </button>
                                            </div>
                                            <p className="text-gray-400 text-xs mt-1">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            )}

            {/* Deletion Modal */}
            {categoryToDelete && (
                <DeleteCategoryModal 
                    categoryId={categoryToDelete._id}
                    category={categoryToDelete}
                    onDeleteSuccess={handleDeleteSuccess}
                    onCancel={() => setCategoryToDelete(null)}
                />
            )}
            
            {/* Category Form Modal */}
            {categoriesForm && (
                <div className="fixed inset-0 z-50">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                    
                    <div className="relative w-full h-full bg-black overflow-y-auto">
                        <div className="sticky top-0 z-10 bg-black/90 backdrop-blur-xl border-b border-white/10">
                            <div className="max-w-7xl mx-auto px-6">
                                <div className="flex justify-between items-center h-20">
                                    <h2 className="text-2xl font-bold">
                                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                                            Create Ad Space
                                        </span>
                                    </h2>
                                    <button
                                        onClick={handleCloseCategoriesForm}
                                        className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                                    >
                                        <X className="w-6 h-6 text-white/80" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="max-w-7xl mx-auto px-6 py-12">
                            <CategoriesComponents onSubmitSuccess={handleCloseCategoriesForm} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WebsiteDetails;