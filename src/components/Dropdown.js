// DropdownSelector.js
import React, { useState } from 'react';
import '../style/DropdownSelector.css';

const DropdownSelector = ({ options, label, onSelect }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOptionClick = (option) => {
    onSelect(option);
    toggleDropdown(); // Close the dropdown after selecting an option
  };

  return (
    <div className={`dropdown-container ${isDropdownOpen ? 'expanded' : ''}`}>
      <button onClick={toggleDropdown} className="dropdown-button">
        {label}
        <span className={`arrow ${isDropdownOpen ? 'up' : 'down'}`}>&#9650;</span>
      </button>

      {isDropdownOpen && (
        <div className="dropdown-menu">
          {options.map((option, index) => (
            <div
              key={index}
              className="dropdown-option"
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownSelector;
