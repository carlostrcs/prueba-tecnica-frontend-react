import React from 'react';
import PhoneInput from 'react-phone-number-input';
import { isPossiblePhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import '../PhoneNumberInput.css';
interface PhoneNumberInputProps {
    value: string;
    onChange: (value: string) => void;
    error?: string;
    onValidationChange?: (isValid: boolean) => void;
    className?: string;
    label?: string;
    placeholder?: string;
    defaultCountry?: string;
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
                                                               value,
                                                               onChange,
                                                               error,
                                                               onValidationChange,
                                                               className = '',
                                                               label = 'Teléfono',
                                                               placeholder = 'Ingrese número de teléfono',
                                                               //defaultCountry = "US" 
                                                           }) => {
    const handleChange = (newValue: string | undefined) => {
        const phoneValue = newValue || '';
        onChange(phoneValue);

        // Validar el número de teléfono
        const isValid = phoneValue ? isPossiblePhoneNumber(phoneValue) : false;
        if (onValidationChange) {
            onValidationChange(isValid);
        }
    };

    return (
        <div>
            {label && <label className="phone-input-label">{label}</label>}
            <div className={className} style={{width: "200px"}}>
                <PhoneInput
                    international
                    defaultCountry="US"
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className={error ? 'phone-input-error' : ''}
                    //countryCallingCodeEditable={false}
                />
                {error && <div className="error-message">{error}</div>}
            </div>
        </div>
    );
};

export default PhoneNumberInput;