import React from 'react';

const DownloadButton = ({ onClick, label }) => {
    return (
        <button className="btn btn-success" onClick={onClick}>
            {label || 'Download'}
        </button>
    );
};

export default DownloadButton;
