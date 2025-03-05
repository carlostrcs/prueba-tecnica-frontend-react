import React, { useState, useEffect } from 'react';
import {User} from "../models/user.interface.ts";
import {UserModalProps} from "../models/UserModalProps.interface.ts";
import InternationalPhoneInput from "./InternationalPhoneInput.tsx";
import PhoneNumberInput from "./PhoneNumberInput.tsx";




const UserModal: React.FC<UserModalProps> = ({ isOpen, mode, user, onClose, onSave }) => {
    const [title, setTitle] = useState<string>('');
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [phone1, setPhone1] = useState<string>('');
    const [phone2, setPhone2] = useState<string>('');
    const [country, setCountry] = useState<string>('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [selectedPhone, setSelectedPhone] = useState<'phone1' | 'phone2'>('phone1');

    useEffect(() => {
        if (mode === 'edit' && user) {
            setTitle(user.name.title);
            setFirstName(user.name.first);
            setLastName(user.name.last);
            setEmail(user.email);
            setPhone1(user.phone);
            setPhone2(user.phone);
            setCountry(user.location.country);
        } else {
            setTitle('Mr');
            setFirstName('');
            setLastName('');
            setEmail('');
            setPhone1('');
            setPhone2('');
            setCountry('');
        }
        // Reset errors when modal opens/changes
        setErrors({});
    }, [isOpen, mode, user]);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!firstName.trim()) {
            newErrors.firstName = 'El nombre es obligatorio';
        }

        if (!lastName.trim()) {
            newErrors.lastName = 'El apellido es obligatorio';
        }

        if (!email.trim()) {
            newErrors.email = 'El email es obligatorio';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'El formato del email no es válido';
        }

        // Validar el teléfono seleccionado
        if (selectedPhone === 'phone1') {
            if (!phone1.trim()) {
                newErrors.phone1 = 'El teléfono es obligatorio';
            }
        } else {
            if (!phone2.trim()) {
                newErrors.phone2 = 'El teléfono es obligatorio';
            }
        }

        if (!country.trim()) {
            newErrors.country = 'El país es obligatorio';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent): void => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const updatedData: Partial<User> = {
            name: { title, first: firstName, last: lastName },
            email,
            phone: selectedPhone === 'phone1' ? phone1 : phone2,
            location: { country }
        };

        onSave(updatedData);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>{mode === 'edit' ? 'Editar Usuario' : 'Añadir Usuario'}</h2>

                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Nombre:
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className={errors.firstName ? 'error' : ''}
                            />
                        </label>
                        {errors.firstName && <div className="error-message">{errors.firstName}</div>}
                    </div>
                    <div>
                        <label>Apellido:
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className={errors.lastName ? 'error' : ''}
                            />
                        </label>
                        {errors.lastName && <div className="error-message">{errors.lastName}</div>}
                    </div>
                    <div>
                        <label>Email:
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={errors.email ? 'error' : ''}
                            />
                        </label>
                        {errors.email && <div className="error-message">{errors.email}</div>}
                    </div>

                    {/* COMPONENTES DE TELÉFONO PARA COMPARACIÓN */}
                    <div className="phone-inputs-comparison">
                        <div className="phone-option">
                            <div className="phone-selector">
                                <input
                                    type="radio"
                                    id="phone1-selector"
                                    name="phone-selector"
                                    checked={selectedPhone === 'phone1'}
                                    onChange={() => setSelectedPhone('phone1')}
                                />
                                <label htmlFor="phone1-selector">Usar este teléfono</label>
                            </div>

                            <div className="phone-input-container">
                                <PhoneNumberInput
                                    value={phone1}
                                    onChange={setPhone1}
                                    error={selectedPhone === 'phone1' ? errors.phone1 : undefined}
                                    label="Teléfono (react-phone-number-input):"
                                    defaultCountry="ES"
                                />
                            </div>
                        </div>

                        <div className="phone-option">
                            <div className="phone-selector">
                                <input
                                    type="radio"
                                    id="phone2-selector"
                                    name="phone-selector"
                                    checked={selectedPhone === 'phone2'}
                                    onChange={() => setSelectedPhone('phone2')}
                                />
                                <label htmlFor="phone2-selector">Usar este teléfono</label>
                            </div>

                            <div className="phone-input-container">
                                <InternationalPhoneInput
                                    value={phone2}
                                    onChange={setPhone2}
                                    error={selectedPhone === 'phone2' ? errors.phone2 : undefined}
                                    label="Teléfono (react-international-phone):"
                                    defaultCountry="es"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label>País:
                            <input
                                type="text"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                className={errors.country ? 'error' : ''}
                            />
                        </label>
                        {errors.country && <div className="error-message">{errors.country}</div>}
                    </div>
                    <div className="modal-buttons">
                        <button type="submit">Guardar</button>
                        <button type="button" onClick={onClose}>Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default UserModal;
