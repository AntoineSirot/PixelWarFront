import React from 'react';
import './../App.css';

function ColorButton({ color, onClick }) {
    return (
        <button
            className={`button-style button-${color.toLowerCase()}`}
            onClick={onClick}
        >
            {color}
        </button>
    );
}

export default ColorButton;
