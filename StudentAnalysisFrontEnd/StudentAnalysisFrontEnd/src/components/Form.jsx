import React from 'react';

const Form = ({ fields, onSubmit, buttonText }) => {
    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());
        onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit}>
            {fields.map((field, index) => (
                <div key={index} className="form-group">
                    <label>{field.label}</label>
                    <input
                        type={field.type || 'text'}
                        name={field.name}
                        placeholder={field.placeholder}
                        required={field.required}
                        className="form-control"
                    />
                </div>
            ))}
            <button type="submit" className="btn btn-primary">
                {buttonText || 'Submit'}
            </button>
        </form>
    );
};

export default Form;
