import React, { useState, ChangeEvent, KeyboardEvent } from 'react';
import axios from 'axios';

interface EntryFieldProps {
  apiUrl: string; // Pass the API endpoint as a prop
}

const EntryField: React.FC<EntryFieldProps> = ({ apiUrl }) => {
  const [inputValue, setInputValue] = useState<string>('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleKeyDown = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      try {
        // Make a POST request to the specified API endpoint
        await axios.post(apiUrl, { value: inputValue });

        // Optionally, you can clear the input field after the request
        setInputValue('');
      } catch (error) {
        console.error('Error sending data:', error);
      }
    }
  };

  return (
    <div>
      <label htmlFor="userInput">Enter Value:</label>
      <input
        type="text"
        id="userInput"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default EntryField;
