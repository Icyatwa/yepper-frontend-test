import React, { useState } from 'react';
import { Calendar, Clock, RefreshCw, Check, ChevronDown, ChevronUp, X } from 'lucide-react';
import DatePicker from 'react-datepicker';

const AvailabilitySelector = ({ 
  value,
  onChange,
  onReset,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onSaveDateRange
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const availabilityOptions = [
    { 
      label: 'Available now', 
      icon: <Clock className="text-green-500" />,
      description: 'Immediate availability' 
    },
    { 
      label: 'Reserved for future date', 
      icon: <Calendar className="text-blue-500" />,
      description: 'Select specific date range' 
    },
    { 
      label: 'Always available', 
      icon: <RefreshCw className="text-purple-500" />,
      description: 'Continuous accessibility' 
    },
    { 
      label: 'Pick a date', 
      icon: <Calendar className="text-orange-500" />,
      description: 'Choose specific date' 
    }
  ];

  const isDateOption = value === 'Reserved for future date' || value === 'Pick a date';

  const handleOptionSelect = (optionLabel) => {
    onChange(optionLabel);
    if (optionLabel.includes('date')) {
      setShowDatePicker(true);
    } else {
      setShowOptions(false);
      setShowDatePicker(false);
    }
  };

  const Modal = ({ children, onClose }) => (
    <div className="fixed inset-0 z-50 overflow-y-auto" onClick={onClose}>
      <div className="flex min-h-full items-end justify-center sm:items-center p-4">
        <div 
          className="bg-white w-full max-w-md rounded-t-xl sm:rounded-xl shadow-lg"
          onClick={e => e.stopPropagation()}
        >
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                {showDatePicker ? "Select Dates" : "Select Availability"}
              </h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                <X size={20} />
              </button>
            </div>
          </div>
          <div className="px-4 py-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative inline-block">
      <div 
        className={`
          flex items-center justify-between 
          px-3 py-2 
          text-sm
          border rounded-md 
          cursor-pointer 
          transition-all 
          ${value !== 'Select Availability' 
            ? 'border-blue-500 bg-blue-50 text-blue-700' 
            : 'border-gray-300 text-gray-700 hover:border-blue-300'}
        `}
        onClick={() => setShowOptions(true)}
      >
        <div className="flex items-center">
          {showOptions ? <ChevronUp size={20} className="mr-2" /> : <ChevronDown size={20} className="mr-2" />}
          {value}
        </div>
        {value !== 'Select Availability' && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onReset();
              setShowOptions(false);
              setShowDatePicker(false);
            }}
            className="text-red-500 hover:text-red-600"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {showOptions && (
        <Modal onClose={() => setShowOptions(false)}>
          <div className="space-y-2">
            {availabilityOptions.map((option, index) => (
              <div
                key={index}
                className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 cursor-pointer rounded-lg transition-colors group"
                onClick={() => handleOptionSelect(option.label)}
              >
                <div className="flex items-center space-x-2">
                  {option.icon}
                  <div>
                    <p className="font-medium text-gray-800 group-hover:text-blue-600 text-sm">
                      {option.label}
                    </p>
                    <p className="text-xs text-gray-500">
                      {option.description}
                    </p>
                  </div>
                </div>
                {value === option.label && (
                  <Check className="text-green-500" size={20} />
                )}
              </div>
            ))}
          </div>
        </Modal>
      )}

      {isDateOption && showDatePicker && (
        <Modal onClose={() => setShowDatePicker(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <DatePicker
                selected={startDate}
                onChange={onStartDateChange}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                minDate={new Date()}
                dateFormat="dd/MM/yyyy"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <DatePicker
                selected={endDate}
                onChange={onEndDateChange}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate || new Date()}
                dateFormat="dd/MM/yyyy"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button 
              onClick={() => {
                onSaveDateRange?.();
                setShowDatePicker(false);
              }}
              className="w-full px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Save Date Range
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AvailabilitySelector;