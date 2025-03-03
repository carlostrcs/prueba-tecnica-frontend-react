import React, { useEffect, useState } from 'react';
import UserTable from './components/UserTable';
import UserModal from './components/UserModal';
import './App.css';
import {userService} from "./services/userService.ts";
import {User} from "./models/user.interface.ts";

const App: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [originalUsers, setOriginalUsers] = useState<User[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch users from the API using our service
    const fetchUsers = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const fetchedUsers = await userService.fetchUsers(100);
            setUsers(fetchedUsers);
            setOriginalUsers(fetchedUsers);
        } catch (error) {
            setError('Failed to load users. Please try again later.');
            console.error('Error fetching users:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Delete user
    const handleDelete = (userId: string): void => {
        setUsers(prevUsers => prevUsers.filter(user => user.login.uuid !== userId));
    };

    // Open modal in edit mode
    const handleEdit = (user: User): void => {
        setSelectedUser(user);
        setModalMode('edit');
        setIsModalOpen(true);
    };

    // Open modal in add mode
    const handleAdd = (): void => {
        setSelectedUser(null);
        setModalMode('add');
        setIsModalOpen(true);
    };

    // Restore the original users
    const handleRestore = (): void => {
        setUsers(originalUsers);
    };

    // Save changes after edit or add
    const handleSave = (updatedData: Partial<User>): void => {
        if (modalMode === 'edit' && selectedUser) {
            // Use the service to update the user
            const updatedUser = userService.updateUser(selectedUser, updatedData);

            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user.login.uuid === updatedUser.login.uuid ? updatedUser : user
                )
            );
        } else if (modalMode === 'add') {
            // Use the service to create a new user
            const newUser = userService.createUser(updatedData);
            setUsers(prevUsers => [...prevUsers, newUser]);
        }
        setIsModalOpen(false);
    };

    const closeModal = (): void => {
        setIsModalOpen(false);
    };

    return (
        <div className="App">
            <h1>Listado de Usuarios</h1>

            {error && <div className="error-message">{error}</div>}

            <div className="actions">
                <button onClick={handleAdd}>Añadir</button>
                <button onClick={handleRestore}>Restaurar</button>
            </div>

            {isLoading ? (
                <div className="loading">Cargando usuarios...</div>
            ) : (
                <UserTable users={users} onDelete={handleDelete} onEdit={handleEdit} />
            )}

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
