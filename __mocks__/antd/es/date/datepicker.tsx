import React from 'react';

const MockDatePicker = ({ value, onChange }) => {
  const handleChange = (newValue) => {
    onChange(newValue);
  };

  return (
    <div>
      <p>huinya</p>
      <input 
        type="date" 
        value={value} 
        onChange={(e) => handleChange(e.target.value)} 
      />
    </div>
  );
};

export default MockDatePicker;
