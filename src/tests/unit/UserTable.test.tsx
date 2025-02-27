import * as React from 'react';
import {render, screen, fireEvent, within} from '@testing-library/react';
import UserTable from "../../components/UserTable.tsx";
import {User} from "../../App.tsx";
import '@testing-library/jest-dom';

const sampleUser: User = {
    login: { uuid: '1' },
    name: { title: 'Sr.', first: 'Juan', last: 'Pérez' },
    email: 'juan.perez@example.com',
    picture: {
        thumbnail: 'https://via.placeholder.com/50',
        medium: 'https://via.placeholder.com/100',
        large: 'https://via.placeholder.com/150',
    },
    location: { country: 'España' },
};

// TestWrapper: Componente de prueba que envuelve al UserTable y simula la renderización de un modal
const TestWrapper: React.FC = () => {
    const [editedUser, setEditedUser] = React.useState<User | null>(null);
    return (
        <div>
            <UserTable
                users={[sampleUser]}
                onDelete={() => {}}
                onEdit={(user: User) => setEditedUser(user)}
            />
            {editedUser && (
                <div role="dialog">
                    <h2>Editar Usuario</h2>
                    <p>{`${editedUser.name.title} ${editedUser.name.first} ${editedUser.name.last}`}</p>
                    <p>{editedUser.email}</p>
                </div>
            )}
        </div>
    );
};

describe('UserTable Component', () => {
    it('should render a table row with user data and buttons, and call callbacks on click', () => {
        const mockOnDelete = jest.fn();
        const mockOnEdit = jest.fn();

        // Creamos el elemento
        const element = React.createElement(UserTable, {
            users: [sampleUser],
            onDelete: mockOnDelete,
            onEdit: mockOnEdit,
        });
        render(element);

        // Verificamos que se muestra el nombre completo
        const fullName = `${sampleUser.name.title} ${sampleUser.name.first} ${sampleUser.name.last}`;
        expect(screen.getByText(fullName)).toBeInTheDocument();

        // Verificamos que se muestra el email
        expect(screen.getByText(sampleUser.email)).toBeInTheDocument();

        // Buscamos los botones "Editar" y "Eliminar"
        const editButton = screen.getByText('Editar');
        const deleteButton = screen.getByText('Eliminar');
        expect(editButton).toBeInTheDocument();
        expect(deleteButton).toBeInTheDocument();

        // Simulamos clicks en ambos botones
        fireEvent.click(editButton);
        fireEvent.click(deleteButton);

        // Verificamos que las funciones callback hayan sido llamadas
        expect(mockOnEdit).toHaveBeenCalledTimes(1);
        expect(mockOnDelete).toHaveBeenCalledTimes(1);
    });

    it('should render a modal with user information when the "Editar" button is clicked', () => {
        // Renderizamos el TestWrapper que simula la lógica del modal
        render(<TestWrapper />);

        // Antes de hacer clic, no debe existir el modal (no hay elemento con role "dialog")
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

        // Simulamos el clic en el botón "Editar"
        const editButton = screen.getByText('Editar');
        fireEvent.click(editButton);

        // Ahora el modal debe aparecer
        const modal = screen.getByRole('dialog');
        expect(modal).toBeInTheDocument();
        const modalQueries = within(modal);
        // Verificamos que el modal muestra un encabezado y la información del usuario
        expect(screen.getByText('Editar Usuario')).toBeInTheDocument();
        const fullName = `${sampleUser.name.title} ${sampleUser.name.first} ${sampleUser.name.last}`;
        expect(modalQueries.getByText(fullName)).toBeInTheDocument();
        expect(modalQueries.getByText(sampleUser.email)).toBeInTheDocument();
    });
});