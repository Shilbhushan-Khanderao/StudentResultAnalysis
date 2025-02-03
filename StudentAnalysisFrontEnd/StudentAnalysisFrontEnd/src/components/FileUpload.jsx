import React from 'react';

const FileUpload = ({ onFileChange, label }) => {
    return (
        <div className="file-upload">
            <label>{label}</label>
            <input
                type="file"
                onChange={(e) => onFileChange(e.target.files[0])}
                className="form-control"
            />
        </div>
    );
};

export default FileUpload;
