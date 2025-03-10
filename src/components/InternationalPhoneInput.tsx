import React, { useRef } from 'react';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import '../InternationalPhoneInput.css';
import {usePhoneInputTranslation} from "../hooks/usePhoneInputTranslation.ts";

interface InternationalPhoneInputProps {
    value: string;
    onChange: (value: string) => void;
    error?: string;
    onValidationChange?: (isValid: boolean) => void;
    className?: string;
    label?: string;
    placeholder?: string;
    defaultCountry?: string;
    language?: string; // Idioma para las traducciones
}


const InternationalPhoneInput: React.FC<InternationalPhoneInputProps> = ({
                                                                             value,
                                                                             onChange,
                                                                             error,
                                                                             onValidationChange,
                                                                             className = '',
                                                                             label = 'Teléfono',
                                                                             placeholder = 'Ingrese número de teléfono',
                                                                             language = 'fr' // Idioma por defecto
                                                                             //defaultCountry = 'es'
                                                                         }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    usePhoneInputTranslation(containerRef, language);
    
    const handleChange = (newValue: string) => {
        onChange(newValue);

        // Validación básica
        const isValid = newValue.length > 8;
        if (onValidationChange) {
            onValidationChange(isValid);
        }
    };
    
    return (
        <div ref={containerRef}>
            {label && <label className="phone-input-label">{label}</label>}
            <div className={className} style={{width: "200px"}}>
                <PhoneInput
                    //defaultCountry={defaultCountry}
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className={error ? 'phone-input-error' : ''}
                    //showFlags={true}
                    //forceDialCode={true}
                />
                {error && <div className="error-message">{error}</div>}
            </div>
        </div>
    );
};

export default InternationalPhoneInput;