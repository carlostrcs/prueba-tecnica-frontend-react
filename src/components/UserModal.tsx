import React, { useState, useEffect } from 'react';
import { User } from '../App';

interface UserModalProps {
    isOpen: boolean;
    mode: 'add' | 'edit';
    user: User | null;
    onClose: () => void;
    onSave: (userData: Partial<User>) => void;
}

const UserModal: React.FC<UserModalProps> = ({ isOpen, mode, user, onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [country, setCountry] = useState('');

    useEffect(() => {
        if (mode === 'edit' && user) {
            setTitle(user.name.title);
            setFirstName(user.name.first);
            setLastName(user.name.last);
            setEmail(user.email);
            setCountry(user.location.country);
        } else {
            setFirstName('');
            setLastName('');
            setEmail('');
            setCountry('');
        }
    }, [isOpen, mode, user]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const updatedData: Partial<User> = {
            name: { title:title, first: firstName, last: lastName },
            email: email,
            location: { country: country }
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
                        <label>Nombre:</label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Apellido:</label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>País:</label>
                        <input
                            type="text"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            required
                        />
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
