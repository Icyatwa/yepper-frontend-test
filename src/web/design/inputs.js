// Input.js
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './styles/inputs.css';

function Input({ onSubmit, onFocus, onBlur  }) {
  const [inputValue, setInputValue] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('USD'); // New state for currency
  const [suggestions, setSuggestions] = useState([]);
  const [availability, setAvailability] = useState('Select Availability');
  const [availabilityOptionsVisible, setAvailabilityOptionsVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [currentOption, setCurrentOption] = useState('');
  const [isInstructionsVisible, setInstructionsVisible] = useState(false);
  const [instructions, setInstructions] = useState('');

  const paymentOptions = ['per hour', 'per day', 'per week', 'per month', 'per year'];
  const availabilityOptions = ['Available now', 'Reserved for future date', 'Always available', 'Pick a date'];

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setErrorMessage('');

    if (value) {
      const [numberPart] = extractValidParts(value);

      if (numberPart && !isNaN(numberPart)) {
        const filteredSuggestions = paymentOptions.map(option => `${numberPart} ${option}`);
        setSuggestions(filteredSuggestions);
      } else {
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleCurrencyChange = (e) => {
    setSelectedCurrency(e.target.value);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    setSuggestions([]);
  };

  const handleAvailabilityClick = () => {
    setAvailabilityOptionsVisible(!availabilityOptionsVisible);
  };

  const handleAvailabilityOptionClick = (option) => {
    if (option === 'Reserved for future date' || option === 'Pick a date') {
      setCurrentOption(option);
      setDatePickerVisible(true);
    } else {
      setAvailability(option);
      setDatePickerVisible(false);
      setAvailabilityOptionsVisible(false);
    }
  };

  const resetAvailability = () => {
    setAvailability('Select Availability');
    setStartDate(null);
    setEndDate(null);
    setDatePickerVisible(false);
  };

  const validateInput = () => {
    const isValid = paymentOptions.some(option => inputValue.endsWith(option));

    if (!isValid) {
      setErrorMessage('Please select a valid option (e.g., per day, per week, per month, per year)');
    }

    return isValid;
  };

  const handleSubmit = () => {
    if (validateInput()) {
      // Include currency in front of the input value
      const formattedValue = `${selectedCurrency} ${inputValue}`;
      onSubmit(formattedValue, instructions, availability);
    }
  };

  const saveDateRange = () => {
    if (startDate && endDate) {
      const formattedDateRange = `${formatDate(startDate)} to ${formatDate(endDate)}`;
      setAvailability(`${currentOption}: ${formattedDateRange}`);
      setDatePickerVisible(false);
      setAvailabilityOptionsVisible(false);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const toggleInstructions = () => {
    setInstructionsVisible(!isInstructionsVisible);
  };

  const handleInstructionsChange = (e) => {
    setInstructions(e.target.value);
  };

  return (
    <div>
      <div className="space-contents">
        <div className="input-wrapper">
          <select 
            className="currency-select"
            value={selectedCurrency}
            onChange={handleCurrencyChange}
            onFocus={onFocus}
            onBlur={onBlur}
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="RWF">RWF</option>
          </select>
          <input
            type="text"
            placeholder="Enter amount"
            className="input-field"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </div>

        {suggestions.length > 0 && (
          <div className="suggestions-container">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {highlightMatch(suggestion, inputValue)}
              </div>
            ))}
          </div>
        )}

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <div className="availability-section" style={{ position: 'relative' }}>
          <span
            className={`availability-span ${availability !== 'Select Availability' ? 'selected' : ''}`}
            onClick={handleAvailabilityClick}
          >
            {availability}
          </span>
          {availabilityOptionsVisible && (
            <div className="availability-options-container">
              {availabilityOptions.map((option, index) => (
                <div
                  key={index}
                  className="availability-option"
                  onClick={() => handleAvailabilityOptionClick(option)}
                >
                  {option}
                </div>
              ))}
            </div>
          )}

          {availability !== 'Select Availability' && (
            <button className="reset-button" onClick={resetAvailability}>
              Reset
            </button>
          )}

          {isDatePickerVisible && (
            <div className="date-picker-container">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                minDate={new Date()}
                placeholderText="Start Date"
                dateFormat="dd/MM/yyyy"
              />
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate || new Date()}
                placeholderText="End Date"
                dateFormat="dd/MM/yyyy"
              />
              <button onClick={saveDateRange} className="save-date-button">
                Save
              </button>
            </div>
          )}
        </div>

        <div className="instructions-button-wrapper">
          <button className="toggle-instructions-button" onClick={toggleInstructions}>
            {isInstructionsVisible ? 'Hide Instructions' : 'Add Special Instructions'}
          </button>

          {isInstructionsVisible && (
            <div className="instructions-section">
              <textarea
                className="instructions-textarea"
                placeholder="Enter specific instructions here (e.g., delivery time, special handling instructions, etc.)"
                value={instructions}
                onChange={handleInstructionsChange}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </div>
          )}
        </div>

        <button onClick={handleSubmit} className="submit-button">Submit</button>
      </div>
    </div>
  );
}

function extractValidParts(value) {
  const parts = value.split(' ');
  const numberPart = parts[0] || '';
  const prefixPart = parts.slice(1).join(' ').toLowerCase();

  if (prefixPart.startsWith('per')) {
    return [numberPart, `per ${prefixPart.slice(4)}`.trim()];
  }
  return [numberPart, ''];
}

function highlightMatch(text, match) {
  const parts = text.split(new RegExp(`(${match})`, 'gi'));
  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === match.toLowerCase() ? (
          <strong key={index}>{part}</strong>
        ) : (
          part
        )
      )}
    </>
  );
}

export default Input;
