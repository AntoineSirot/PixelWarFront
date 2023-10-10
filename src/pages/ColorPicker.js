import React, { useState } from 'react';
import { SketchPicker } from 'react-color';

function ColorPicker() {
  const [color, setColor] = useState('#ffffff'); // Couleur initiale
  const [showPicker, setShowPicker] = useState(false);

  const handleClick = () => {
    setShowPicker(!showPicker);
  };

  const handleChange = (newColor) => {
    setColor(newColor.hex);
  };

  return (
    <div>
      <button onClick={handleClick}>Ouvrir la palette de couleurs</button>
      {showPicker && (
        <SketchPicker color={color} onChange={handleChange} />
      )}
      <p>RGB : {color}</p>
    </div>
  );
}

export default ColorPicker;
