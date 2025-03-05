import React from 'react';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

interface InternationalPhoneInputProps {
    value: string;
    onChange: (value: string) => void;
    error?: string;
    onValidationChange?: (isValid: boolean) => void;
    className?: string;
    label?: string;
    placeholder?: string;
    defaultCountry?: string;
}

const InternationalPhoneInput: React.FC<InternationalPhoneInputProps> = ({
                                                                             value,
                                                                             onChange,
                                                                             error,
                                                                             onValidationChange,
                                                                             className = '',
                                                                             label = 'Teléfono',
                                                                             placeholder = 'Ingrese número de teléfono',
                                                                             //defaultCountry = 'es'
                                                                         }) => {
    const handleChange = (newValue: string) => {
        onChange(newValue);

        // Validación básica (puedes ajustar según tus necesidades)
        // Esta librería no tiene una función específica de validación como react-phone-number-input
        const isValid = newValue.length > 8;
        if (onValidationChange) {
            onValidationChange(isValid);
        }
    };

    return (
        <div className={className}>
            {label && <label className="phone-input-label">{label}</label>}
            <PhoneInput
                //defaultCountry={defaultCountry}
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                inputClassName={error ? 'phone-input-error' : ''}
                //showFlags={true}
                forceDialCode={true}
            />
            {error && <div className="error-message">{error}</div>}
        </div>
    );
};

export default InternationalPhoneInput;