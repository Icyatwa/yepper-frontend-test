import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './styles/templates.css';

function Templates() {
    const navigate = useNavigate();
    const location = useLocation();
    const { file, userId, businessName, businessLocation, adDescription, selectedCategories } = location.state || {};

    const [selectedTemplate, setSelectedTemplate] = useState('');

    const templates = [
        { id: 'banner', label: 'Banner', imgSrc: 'https://img.freepik.com/free-photo/new-york-city-manhattan-aerial-view_649448-2832.jpg?uid=R102997587&ga=GA1.1.2142793496.1716934876&semt=sph' },
        { id: 'popup', label: 'Pop-up', imgSrc: 'https://img.freepik.com/free-photo/amazing-beautiful-sky-with-clouds-with-antenna_58702-1670.jpg?uid=R102997587&ga=GA1.1.2142793496.1716934876&semt=ais_hybrid' },
        { id: 'popdown', label: 'Pop-down', imgSrc: 'https://img.freepik.com/premium-photo/dirt-road-through-maize-green-field-blue-sky-ukraine_483766-183.jpg?uid=R102997587&ga=GA1.1.2142793496.1716934876&semt=sph' },
        { id: 'sidebar', label: 'Sidebar', imgSrc: 'https://img.freepik.com/free-photo/vendor-checks-out-groceries-desk_482257-76087.jpg?uid=R102997587&ga=GA1.1.2142793496.1716934876&semt=ais_hybrid' },
        { id: 'fullscreen', label: 'Fullscreen', imgSrc: 'https://img.freepik.com/free-photo/black-man-using-computer_23-2149370615.jpg?uid=R102997587&ga=GA1.1.2142793496.1716934876&semt=ais_hybrid' },
        { id: 'native', label: 'Native', imgSrc: 'https://img.freepik.com/free-photo/black-wooden-table_417767-153.jpg?uid=R102997587&ga=GA1.1.2142793496.1716934876&semt=ais_hybrid' },
        { id: 'carousel', label: 'Carousel', imgSrc: 'https://img.freepik.com/free-photo/young-man-working-warehouse-with-boxes_1303-16615.jpg?uid=R102997587&ga=GA1.1.2142793496.1716934876&semt=sph' },
    ];

    const handleTemplateSelect = (templateId) => {
        setSelectedTemplate(templateId);

        // Automatically navigate to the ad preview page once a template is selected
        navigate('/ad-preview', {
            state: {
                file,
                userId,
                businessName,
                businessLocation,
                adDescription,
                selectedCategories,
                templateType: templateId,
            },
        });
    };

    return (
        <div className='templates-container'>
            <div className='header'>
                <h1>Choose Your Ad Template</h1>
                <p>Select from a variety of customizable templates to create your perfect ad.</p>
            </div>
            <div className='templates-grid'>
                {templates.map(template => (
                    <div key={template.id} className='template-item'>
                        <input
                            type="radio"
                            id={template.id}
                            name="template"
                            value={template.id}
                            checked={selectedTemplate === template.id}
                            onChange={() => handleTemplateSelect(template.id)}
                        />
                        <label htmlFor={template.id}>
                            <img src={template.imgSrc} alt={template.label} />
                            <div className='template-overlay'>
                                <div className='template-info'>
                                    <h3>{template.label}</h3>
                                    <p>Click to preview</p>
                                </div>
                            </div>
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Templates;
