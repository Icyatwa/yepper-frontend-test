import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { useParams, } from 'react-router-dom';
import { useClerk } from '@clerk/clerk-react';
import { 
    Info, 
    Check, 
    Image, 
    Users,
    X,
    FileText,
    ArrowRight,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "./components/card";
import Header from '../../components/backToPreviousHeader';
import PricingTiers from './components/PricingTiers';
import CategoryInfoModal from './components/CategoryInfoModal';

const CategoriesComponent = ({ onSubmitSuccess }) => {
    const { user } = useClerk();
    const { websiteId } = useParams();

    // const [websiteDetails] = useState(state?.websiteDetails || null);
    const [selectedCategories, setSelectedCategories] = useState({});
    const [categoryData, setCategoryData] = useState({});
    const [activeCategory, setActiveCategory] = useState(null);
    const [completedCategories, setCompletedCategories] = useState([]);
    const [activeInfoModal, setActiveInfoModal] = useState(null);

    const isCategoryDataEmpty = (category) => {
        const data = categoryData[category];
        return !data || 
               (!data.price && !data.userCount && !data.instructions);
    };

    useEffect(() => {
        completedCategories.forEach(category => {
            if (isCategoryDataEmpty(category)) {
                setCompletedCategories(prev => 
                    prev.filter(cat => cat !== category)
                );
            }
        });
    }, [categoryData, completedCategories]);

    const categoryDetails = useMemo(() => ({
        aboveTheFold: {
            name: 'Above the Fold',
            icon: <Image className="w-6 h-6" />,
            infoIcon: <Info className="w-5 h-5 text-blue-500 hover:text-blue-600 cursor-pointer" />,
            spaceType: "Above The Fold",
        },
        beneathTitle: {
            name: 'Beneath Title',
            icon: <Image className="w-6 h-6" />,
            infoIcon: <Info className="w-5 h-5 text-blue-500 hover:text-blue-600 cursor-pointer" />,
            spaceType: "Beneath Title",
        },
        bottom: {
            name: 'Bottom',
            icon: <Image className="w-6 h-6" />,
            infoIcon: <Info className="w-5 h-5 text-blue-500 hover:text-blue-600 cursor-pointer" />,
            spaceType: "Bottom",
        },
        floating: {
            name: 'Floating',
            icon: <Image className="w-6 h-6" />,
            infoIcon: <Info className="w-5 h-5 text-blue-500 hover:text-blue-600 cursor-pointer" />,
            spaceType: "Floating",
        },
        HeaderPic: {
            name: 'Header',
            icon: <Image className="w-6 h-6" />,
            infoIcon: <Info className="w-5 h-5 text-blue-500 hover:text-blue-600 cursor-pointer" />,
            spaceType: "Header",
        },
        inFeed: {
            name: 'In Feed',
            icon: <Image className="w-6 h-6" />,
            infoIcon: <Info className="w-5 h-5 text-blue-500 hover:text-blue-600 cursor-pointer" />,
            spaceType: "In Feed",
        },
        inlineContent: {
            name: 'Inline Content',
            icon: <Image className="w-6 h-6" />,
            infoIcon: <Info className="w-5 h-5 text-blue-500 hover:text-blue-600 cursor-pointer" />,
            spaceType: "Inline Content",
        },
        leftRail: {
            name: 'Left Rail',
            icon: <Image className="w-6 h-6" />,
            infoIcon: <Info className="w-5 h-5 text-blue-500 hover:text-blue-600 cursor-pointer" />,
            spaceType: "Left Rail",
        },
        mobileInterstial: {
            name: 'Mobile Interstial',
            icon: <Image className="w-6 h-6" />,
            infoIcon: <Info className="w-5 h-5 text-blue-500 hover:text-blue-600 cursor-pointer" />,
            spaceType: "Mobile Interstial",
        },
        modalPic: {
            name: 'Modal',
            icon: <Image className="w-6 h-6" />,
            infoIcon: <Info className="w-5 h-5 text-blue-500 hover:text-blue-600 cursor-pointer" />,
            spaceType: "modalPic",
        },
        overlay: {
            name: 'Overlay',
            icon: <Image className="w-6 h-6" />,
            infoIcon: <Info className="w-5 h-5 text-blue-500 hover:text-blue-600 cursor-pointer" />,
            spaceType: "overlay",
        },
        proFooter: {
            name: 'Pro Footer',
            icon: <Image className="w-6 h-6" />,
            infoIcon: <Info className="w-5 h-5 text-blue-500 hover:text-blue-600 cursor-pointer" />,
            spaceType: "proFooter",
        },
        rightRail: {
            name: 'Right Rail',
            icon: <Image className="w-6 h-6" />,
            infoIcon: <Info className="w-5 h-5 text-blue-500 hover:text-blue-600 cursor-pointer" />,
            spaceType: "rightRail",
        },
        sidebar: {
            name: 'Sidebar',
            icon: <Image className="w-6 h-6" />,
            infoIcon: <Info className="w-5 h-5 text-blue-500 hover:text-blue-600 cursor-pointer" />,
            spaceType: "sidebar",
        },
        stickySidebar: {
            name: 'Sticky Sidebar',
            icon: <Image className="w-6 h-6" />,
            infoIcon: <Info className="w-5 h-5 text-blue-500 hover:text-blue-600 cursor-pointer" />,
            spaceType: "stickySidebar",
        },

    }), []);

    const handleInfoClick = (e, category) => {
        e.stopPropagation();
        setActiveInfoModal(category);
    };

    const handleCategorySelect = (category) => {
        setActiveCategory(category);
        if (!selectedCategories[category]) {
            setSelectedCategories(prev => ({
                ...prev,
                [category]: true
            }));
        }
    };

    const handleCloseModal = () => {
        setActiveCategory(null);
    };

    const handleUnselect = (e, category) => {
        e.stopPropagation(); // Prevent modal from opening
        setCompletedCategories(prev => prev.filter(cat => cat !== category));
        setCategoryData(prev => ({
            ...prev,
            [category]: {}
        }));
    };

    const updateCategoryData = (category, field, value) => {
        if (field === 'price') {
            // value will now be an object containing price, tier, and visitorRange
            setCategoryData(prev => ({
                ...prev,
                [category]: {
                    ...prev[category],
                    price: value.price,
                    tier: value.tier,
                    visitorRange: value.visitorRange
                }
            }));
            } else {
                // Handle other fields normally
                setCategoryData(prev => ({
                    ...prev,
                    [category]: {
                        ...prev[category],
                        [field]: value
                    }
            }));
        }
    };

    const handleNext = () => {
        if (activeCategory && !isCategoryDataEmpty(activeCategory)) {
            setCompletedCategories(prev => 
                prev.includes(activeCategory) 
                    ? prev 
                    : [...prev, activeCategory]
            );
        }
        setActiveCategory(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        try {
            const categoriesToSubmit = Object.entries(selectedCategories)
                .filter(([category]) => completedCategories.includes(category))
                .map(([category]) => ({
                    ownerId: user?.id,
                    websiteId,
                    categoryName: category.charAt(0).toUpperCase() + category.slice(1),
                    price: categoryData[category]?.price || 0,
                    description: categoryDetails[category]?.description || '',
                    spaceType: categoryDetails[category]?.spaceType,
                    userCount: parseInt(categoryData[category]?.userCount) || 0,
                    instructions: categoryData[category]?.instructions || '',
                    customAttributes: {},
                    webOwnerEmail: user?.emailAddresses[0]?.emailAddress,
                    // Add the new fields
                    visitorRange: categoryData[category]?.visitorRange || { min: 0, max: 10000 },
                    tier: categoryData[category]?.tier || 'bronze'
                }));
        
            const responses = await Promise.all(
                categoriesToSubmit.map(async (category) => {
                const response = await axios.post('http://localhost:5000/api/ad-categories', category);
                return { ...response.data, name: category.categoryName };
                })
            );
        
            const categoriesWithId = responses.reduce((acc, category) => {
                acc[category.name.toLowerCase()] = { 
                    id: category._id, 
                    price: category.price,
                    apiCodes: category.apiCodes
                };
                return acc;
            }, {});
    
          onSubmitSuccess();
        } catch (error) {
            console.error('Failed to submit categories:', error);
        }
    };

    const renderCategoryModal = () => {
        if (!activeCategory) return null;
        
        const details = categoryDetails[activeCategory];
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
                <Card className="w-full max-w-2xl bg-white">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2 text-[#FF4500]">
                                {details.icon}
                                <span className="text-blue-950">
                                    {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Ads
                                </span>
                            </CardTitle>
                            <button 
                                onClick={handleCloseModal}
                                className="p-1 hover:bg-gray-100 rounded-full"
                            >
                                <X className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* <p className="text-gray-600">{details.description}</p> */}
                        <div className="space-y-4">
                            <PricingTiers 
                                selectedPrice={categoryData[activeCategory]?.price || 0}
                                onPriceSelect={(price) => updateCategoryData(activeCategory, 'price', price)}
                            />

                            <div className="flex items-center gap-2">
                                <Users className="w-5 h-5 text-gray-500" />
                                <input
                                    type="number"
                                    placeholder="User count"
                                    className="w-full p-2 border rounded-md focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                                    value={categoryData[activeCategory]?.userCount || ''}
                                    onChange={(e) => updateCategoryData(activeCategory, 'userCount', e.target.value)}
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-gray-500" />
                                <textarea
                                    placeholder="Additional instructions for advertisers"
                                    className="w-full p-2 border rounded-md focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                                    value={categoryData[activeCategory]?.instructions || ''}
                                    onChange={(e) => updateCategoryData(activeCategory, 'instructions', e.target.value)}
                                    rows={3}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end pt-4">
                            <button
                                type="button"
                                onClick={handleNext}
                                className="flex items-center gap-2 px-4 py-2 bg-[#FF4500] text-white rounded-md hover:bg-orange-500 transition-colors"
                            >
                                Next
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    };

    const renderInfoModal = () => (
        <CategoryInfoModal 
            isOpen={!!activeInfoModal}
            onClose={() => setActiveInfoModal(null)}
            category={activeInfoModal}
        />
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8 text-center text-blue-950">Select Ad Categories</h1>
                <form onSubmit={handleSubmit}>
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        {Object.entries(categoryDetails).map(([category, details]) => (
                            <Card 
                                key={category}
                                className={`cursor-pointer transition-all duration-200 ${
                                    completedCategories.includes(category)
                                        ? 'ring-2 ring-green-500 shadow-lg'
                                        : 'hover:shadow-md'
                                }`}
                                onClick={() => handleCategorySelect(category)}
                            >
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 text-[#FF4500]">
                                            {details.icon}
                                            <CardTitle className="text-gray-600">
                                                {details.name}
                                            </CardTitle>
                                            {details.infoIcon && (
                                                <div onClick={(e) => handleInfoClick(e, category)}>
                                                    {details.infoIcon}
                                                </div>
                                            )}
                                        </div>
                                        {completedCategories.includes(category) && (
                                            <button
                                                onClick={(e) => handleUnselect(e, category)}
                                                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                            >
                                                <Check className="w-5 h-5 text-green-500" />
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600 mt-2">{details.description}</p>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                    {completedCategories.length > 0 && (
                        <div className="flex justify-center">
                            <button 
                                type="submit"
                                className="flex items-center justify-center gap-1 px-6 py-3 bg-[#FF4500] hover:bg-orange-500 hover:-translate-y-0.5 text-white font-bold rounded-md transition-all duration-300"
                            >
                                <Check className="w-5 h-5" />
                                Create Categories
                            </button>
                        </div>
                    )}
                </form>
            </div>
            {renderCategoryModal()}
            {renderInfoModal()}
        </div>
    );
};

export default CategoriesComponent;