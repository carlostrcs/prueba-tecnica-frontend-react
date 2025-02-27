import React, { useEffect, useState } from 'react';
import UserTable from './components/UserTable';
import UserModal from './components/UserModal';
import './App.css';

export interface User {
    login: {
        uuid: string;
    };
    name: {
        title: string;
        first: string;
        last: string;
    };
    email: string;
    picture: {
        thumbnail: string;
        medium: string;
        large: string;
    };
    location: {
        country: string;
    };
}

const App: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [originalUsers, setOriginalUsers] = useState<User[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // Obtener 100 usuarios de la API
    const fetchUsers = async () => {
        try {
            const response = await fetch('https://randomuser.me/api/?results=100');
            const data = await response.json();
            setUsers(data.results);
            setOriginalUsers(data.results);
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Eliminar usuario
    const handleDelete = (userId: string): void => {
        setUsers(prevUsers => prevUsers.filter(user => user.login.uuid !== userId));
    };

    // Abrir modal en modo edición
    const handleEdit = (user: User): void => {
        setSelectedUser(user);
        setModalMode('edit');
        setIsModalOpen(true);
    };

    // Abrir modal en modo añadir
    const handleAdd = (): void => {
        setSelectedUser(null);
        setModalMode('add');
        setIsModalOpen(true);
    };

    // Restaurar los 100 usuarios originales
    const handleRestore = (): void => {
        setUsers(originalUsers);
    };

    // Función para guardar los cambios tras editar o añadir
    const handleSave = (updatedData: Partial<User>) => {
        if (modalMode === 'edit' && selectedUser) {
            const updatedUser: User = {
                ...selectedUser,
                ...updatedData,
                name: {
                    ...selectedUser.name,
                    ...updatedData.name
                },
                location: {
                    ...selectedUser.location,
                    ...updatedData.location
                }
            };
            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user.login.uuid === updatedUser.login.uuid ? updatedUser : user
                )
            );
        } else if (modalMode === 'add') {
            const newUser: User = {
                login: { uuid: Date.now().toString() },
                name: {
                    title: 'Mr ',
                    first: updatedData.name?.first || '',
                    last: updatedData.name?.last || ''
                },
                email: updatedData.email || '',
                picture: {
                    thumbnail: 'https://via.placeholder.com/50',
                    medium: 'https://via.placeholder.com/100',
                    large: 'https://via.placeholder.com/150'
                },
                location: {
                    country: updatedData.location?.country || ''
                }
            };
            setUsers(prevUsers => [...prevUsers, newUser]);
        }
        setIsModalOpen(false);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="App">
            <h1>Listado de Usuarios</h1>
            <div className="actions">
                <button onClick={handleAdd}>Añadir</button>
                <button onClick={handleRestore}>Restaurar</button>
            </div>
            <UserTable users={users} onDelete={handleDelete} onEdit={handleEdit} />
            <UserModal
                isOpen={isModalOpen}
                mode={modalMode}
                user={selectedUser}
                onClose={closeModal}
                onSave={handleSave}
            />
        </div>
    );
};

export default App;
