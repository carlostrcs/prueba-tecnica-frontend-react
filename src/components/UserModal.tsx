import React, { useState, useEffect } from 'react';
import {User} from "../models/user.interface.ts";
import {UserModalProps} from "../models/UserModalProps.interface.ts";




const UserModal: React.FC<UserModalProps> = ({ isOpen, mode, user, onClose, onSave }) => {
    const [title, setTitle] = useState<string>('');
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [country, setCountry] = useState<string>('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (mode === 'edit' && user) {
            setTitle(user.name.title);
            setFirstName(user.name.first);
            setLastName(user.name.last);
            setEmail(user.email);
            setCountry(user.location.country);
        } else {
            setTitle('Mr');
            setFirstName('');
            setLastName('');
            setEmail('');
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
