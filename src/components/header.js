import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, PlusIcon, Bell, BellOff } from 'lucide-react';
import { useNotifications } from './NotificationContext';
import Logo from "./logoName";

function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { notifications } = useNotifications();
    const [unreadCount, setUnreadCount] = useState(0);
    const [notificationSound] = useState(new Audio('/notification-sound.mp3')); // Add a sound file to your public folder

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        // Update unread count when new notifications arrive
        setUnreadCount(notifications.filter(n => !n.read).length);
        // Play sound for new notifications
        if (notifications.length > 0 && !notifications[notifications.length - 1].read) {
            notificationSound.play().catch(error => console.log('Sound play failed:', error));
        }
    }, [notifications, notificationSound]);

    const isActiveLink = (path) => {
        return location.pathname === path;
    };

    const handleGetStartedButton = () => {
        navigate('/request');
        setIsOpen(false);
    };

    const handleNotificationClick = (notification) => {
        // Navigate based on notification type
        if (notification.type === 'newPendingAd') {
            navigate(`/pending-ad/${notification.adId}`);
        } else if (notification.type === 'adApproved') {
            navigate(`/approved-detail/${notification.adId}`);
        }
        // Mark notification as read
        notification.read = true;
        setUnreadCount(prev => Math.max(0, prev - 1));
        setShowNotifications(false);
    };

    return (
        <div className={`fixed top-0 w-full z-50 transition-all duration-300 ${
            scrolled ? 'bg-white shadow-md' : 'bg-white'
        }`}>
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16 md:h-20">
                    <Logo />
                    <nav className="hidden md:flex items-center space-x-8">
                        <motion.button 
                            className={`flex items-center text-white px-3 py-2 rounded-lg text-sm font-bold sm:text-base
                            ${isActiveLink('/request') 
                                ? 'bg-orange-500 font-bold pointer-events-none' 
                                : 'bg-[#FF4500] hover:bg-orange-500 transition-colors'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleGetStartedButton}
                        >
                            <PlusIcon className="block h-6 w-6" />
                            New
                        </motion.button>

                        <SignedIn>
                            <div className="relative">
                                <motion.button
                                    className="relative p-2 rounded-full hover:bg-gray-100"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowNotifications(!showNotifications)}
                                >
                                    {unreadCount > 0 ? (
                                        <Bell className="h-6 w-6 text-orange-500" />
                                    ) : (
                                        <BellOff className="h-6 w-6 text-gray-500" />
                                    )}
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                            {unreadCount}
                                        </span>
                                    )}
                                </motion.button>

                                <AnimatePresence>
                                    {showNotifications && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden"
                                        >
                                            <div className="max-h-96 overflow-y-auto">
                                                {notifications.length > 0 ? (
                                                    notifications.map((notification, index) => (
                                                        <div
                                                            key={index}
                                                            onClick={() => handleNotificationClick(notification)}
                                                            className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                                                                notification.read ? 'bg-white' : 'bg-orange-50'
                                                            }`}
                                                        >
                                                            <div className="flex items-start">
                                                                <Bell className={`h-5 w-5 ${
                                                                    notification.type === 'newPendingAd' 
                                                                        ? 'text-orange-500' 
                                                                        : 'text-green-500'
                                                                }`} />
                                                                <div className="ml-3">
                                                                    <p className="text-sm font-medium text-gray-900">
                                                                        {notification.type === 'newPendingAd' 
                                                                            ? 'New Pending Ad' 
                                                                            : 'Ad Approved'}
                                                                    </p>
                                                                    <p className="mt-1 text-sm text-gray-500">
                                                                        {notification.businessName}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="p-4 text-center text-gray-500">
                                                        No notifications
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                            <UserButton afterSignOutUrl='/sign-in' />
                        </SignedIn>
                        <SignedOut>
                            <Link to="/sign-in">Login</Link>
                        </SignedOut>
                    </nav>

                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden rounded-md p-2 inline-flex items-center justify-center text-gray-700 hover:text-orange-500 hover:bg-red-100 transition-colors duration-200 z-50"
                        aria-expanded={isOpen}
                    >
                        <span className="sr-only">Open main menu</span>
                        {isOpen ? (
                            <X className="block h-6 w-6" aria-hidden="true" />
                        ) : (
                            <Menu className="block h-6 w-6" aria-hidden="true" />
                        )}
                    </button>
                </div>
            </div>
            
            <div className={`
                md:hidden 
                fixed 
                inset-0 
                z-40 
                bg-white 
                transition-transform duration-300 ease-in-out transform
                ${isOpen ? 'translate-x-0' : 'translate-x-full'}
            `}>
                <div className="relative pt-20 pb-6 px-4 space-y-6">
                    <motion.button 
                        className={`flex w-full justify-center items-center text-white px-2 py-2 rounded-lg text-sm font-bold sm:text-base
                            ${isActiveLink('/request') 
                                ? 'bg-orange-500 font-bold pointer-events-none' 
                                : 'bg-[#FF4500] hover:bg-orange-500 transition-colors'
                            }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleGetStartedButton}
                    >
                        <PlusIcon className="block h-6 w-6" />
                        New
                    </motion.button>

                    <SignedIn>
                        <div className="flex items-center justify-center space-x-4">
                            <motion.button
                                className="relative p-2 rounded-full hover:bg-gray-100"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowNotifications(!showNotifications)}
                            >
                                {unreadCount > 0 ? (
                                    <Bell className="h-6 w-6 text-orange-500" />
                                ) : (
                                    <BellOff className="h-6 w-6 text-gray-500" />
                                )}
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {unreadCount}
                                    </span>
                                )}
                            </motion.button>
                            <UserButton afterSignOutUrl='/sign-in' />
                        </div>
                        {showNotifications && (
                            <div className="mt-4 bg-white rounded-lg shadow-lg overflow-hidden">
                                <div className="max-h-96 overflow-y-auto">
                                    {notifications.length > 0 ? (
                                        notifications.map((notification, index) => (
                                            <div
                                                key={index}
                                                onClick={() => handleNotificationClick(notification)}
                                                className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                                                    notification.read ? 'bg-white' : 'bg-orange-50'
                                                }`}
                                            >
                                                <div className="flex items-start">
                                                    <Bell className={`h-5 w-5 ${
                                                        notification.type === 'newPendingAd' 
                                                            ? 'text-orange-500' 
                                                            : 'text-green-500'
                                                    }`} />
                                                    <div className="ml-3">
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {notification.type === 'newPendingAd' 
                                                                ? 'New Pending Ad' 
                                                                : 'Ad Approved'}
                                                        </p>
                                                        <p className="mt-1 text-sm text-gray-500">
                                                            {notification.businessName}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-4 text-center text-gray-500">
                                            No notifications
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </SignedIn>
                    <SignedOut>
                        <Link to="/sign-in">Login</Link>
                    </SignedOut>
                </div>
            </div>
        </div>
    );
}

export default Header;