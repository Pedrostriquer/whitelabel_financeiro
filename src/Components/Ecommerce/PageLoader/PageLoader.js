// Dentro de src/Components/ClientView/PageLoader/PageLoader.js

import React from 'react';
import './PageLoader.css';

const PageLoader = ({ isLoading }) => {
    // A classe 'visible' controla a aparição e o desaparecimento suave
    return (
        <div className={`page-loader-overlay ${isLoading ? 'visible' : ''}`}>
            <div className="loader-spinner"></div>
        </div>
    );
};

export default PageLoader;