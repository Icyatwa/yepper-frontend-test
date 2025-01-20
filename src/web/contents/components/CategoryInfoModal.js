import React from 'react';
import { X } from 'lucide-react';

import AboveTheFoldContainer from '../descriptions/aboveTheFold';
import BeneathTitleContainer from '../descriptions/beneathTitle';
import BottomContainer from '../descriptions/bottom';
import FloatingContainer from '../descriptions/floating';
import HeaderPicContainer from '../descriptions/header';
import InFeedContainer from '../descriptions/inFeed';
import InlineContentContainer from '../descriptions/inlineContent';
import LeftRailContainer from '../descriptions/leftRail';
import MobileInterstialContainer from '../descriptions/mobileInterstial';
import ModalPicContainer from '../descriptions/modal';
import OverlayContainer from '../descriptions/overlay';
import ProFooterContainer from '../descriptions/proFooter';
import RightRailContainer from '../descriptions/rightRail';
import SidebarContainer from '../descriptions/sidebar';
import StickySidebarContainer from '../descriptions/stickySidebar';

const CategoryInfoModal = ({ isOpen, onClose, category }) => {
    if (!isOpen) return null;

    // Add debugging log to see what category is being passed
    console.log('Current category:', category);

    // Create a normalized mapping that handles different case variations
    const CategoryComponents = {
        'aboveTheFold': AboveTheFoldContainer,
        'beneathTitle': BeneathTitleContainer,
        'bottom': BottomContainer,
        'floating': FloatingContainer,
        'HeaderPic': HeaderPicContainer,
        'headerPic': HeaderPicContainer, // Add alternative case
        'inFeed': InFeedContainer,
        'infeed': InFeedContainer, // Add alternative case
        'inlineContent': InlineContentContainer,
        'leftRail': LeftRailContainer,
        'mobileInterstial': MobileInterstialContainer,
        'modalPic': ModalPicContainer,
        'overlay': OverlayContainer,
        'proFooter': ProFooterContainer,
        'rightRail': RightRailContainer,
        'sidebar': SidebarContainer,
        'stickySidebar': StickySidebarContainer
    };

    const CategoryComponent = CategoryComponents[category];

    // Add debugging log to see if component is found
    console.log('Found component:', !!CategoryComponent);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
            <div className="relative w-full h-full">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
                >
                    <X className="w-6 h-6 text-gray-600" />
                </button>
                {CategoryComponent && <CategoryComponent />}
            </div>
        </div>
    );
};

export default CategoryInfoModal;