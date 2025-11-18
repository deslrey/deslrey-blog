import React from 'react';
import './index.css';

interface CheckboxProps {
    checked: boolean;
    onChange: () => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange }) => {
    return (
        <div className="toggle-wrapper" onClick={onChange}>
            <div className={`bars ${checked ? 'open' : ''}`} id="bar1"></div>
            <div className={`bars ${checked ? 'open' : ''}`} id="bar2"></div>
            <div className={`bars ${checked ? 'open' : ''}`} id="bar3"></div>
        </div>
    );
};

export default Checkbox;
