import React from 'react';
import style from './LoaderStyle.js';

export default function Loader() {
    return (
        <div style={style.loaderOverlay}>
            <div style={style.loaderSpinner}></div>
        </div>
    );
}