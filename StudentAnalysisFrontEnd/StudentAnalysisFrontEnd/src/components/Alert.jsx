import React from 'react';

const Alert = ({ type, message }) => {
    const alertClass = type === 'success' ? 'alert-success' : 'alert-danger';
    return <div className={`alert ${alertClass}`}>{message}</div>;
};

export default Alert;
