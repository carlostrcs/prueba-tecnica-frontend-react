import { render, screen, fireEvent } from '@testing-library/react';
import UserModal from "../../components/UserModal.tsx";
import {User} from "../../models/user.interface";
import '@testing-library/jest-dom';
import '@testing-library/user-event';



const mockUser: User = {
    login: { uuid: '123' },
    name: { title: 'Mr', first: 'John', last: 'Doe' },
    email: 'john.doe@example.com',
    picture: {
        thumbnail: 'thumb.jpg',
        medium: 'medium.jpg',
        large: 'large.jpg',
    },
    location: { country: 'USA' },
};

describe('UserModal Component', () => {
    const mockOnClose = jest.fn();
    const mockOnSave = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should not render when isOpen is false', () => {
        // @ts-ignore
        render(
            <UserModal
                isOpen={false}
                mode="add"
                user={null}
                onClose={mockOnClose}
                onSave={mockOnSave}
            />
    );

        expect(screen.queryByText('Añadir Usuario')).not.toBeInTheDocument();
        expect(screen.queryByText('Editar Usuario')).not.toBeInTheDocument();
    });

    it('should render add mode correctly', () => {
        render(
            <UserModal
                isOpen={true}
        mode="add"
        user={null}
        onClose={mockOnClose}
        onSave={mockOnSave}
        />
    );

        expect(screen.getByText('Añadir Usuario')).toBeInTheDocument();

        // Find inputs by their surrounding labels
        const emailLabel = screen.getByText('Email:');
        const paisLabel = screen.getByText('País:');

        // Find the closest input to each label
        const emailInput = emailLabel.parentElement?.querySelector('input');
        const paisInput = paisLabel.parentElement?.querySelector('input');
        
        // Check that form fields are empty
        const inputs = screen.getAllByRole('textbox');
        expect(inputs[0]).toHaveValue(''); // Nombre
        expect(inputs[1]).toHaveValue(''); // Apellido
        expect(paisInput).toHaveValue('');
        expect(emailInput).toHaveValue('');
    });

    it('should render edit mode correctly with user data', () => {
        render(
            <UserModal
                isOpen={true}
        mode="edit"
        user={mockUser}
        onClose={mockOnClose}
        onSave={mockOnSave}
        />
    );

        expect(screen.getByText('Editar Usuario')).toBeInTheDocument();

        // Find inputs by their surrounding labels
        const nombreLabel = screen.getByText('Nombre:');
        const apellidoLabel = screen.getByText('Apellido:');
        const emailLabel = screen.getByText('Email:');
        const paisLabel = screen.getByText('País:');

        // Find the closest input to each label
        const nombreInput = nombreLabel.parentElement?.querySelector('input');
        const apellidoInput = apellidoLabel.parentElement?.querySelector('input');
        const emailInput = emailLabel.parentElement?.querySelector('input');
        const paisInput = paisLabel.parentElement?.querySelector('input');

        // Check that form fields contain user data
        expect(nombreInput).toHaveValue('John');
        expect(apellidoInput).toHaveValue('Doe');
        expect(emailInput).toHaveValue('john.doe@example.com');
        expect(paisInput).toHaveValue('USA');
    });

    it('should call onClose when cancel button is clicked', () => {
        render(
            <UserModal
                isOpen={true}
        mode="add"
        user={null}
        onClose={mockOnClose}
        onSave={mockOnSave}
        />
    );

        fireEvent.click(screen.getByText('Cancelar'));
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should validate form and call onSave with correct data when save button is clicked', () => {
        render(
            <UserModal
                isOpen={true}
        mode="add"
        user={null}
        onClose={mockOnClose}
        onSave={mockOnSave}
        />
    );

        // Find inputs by their surrounding labels
        const nombreLabel = screen.getByText('Nombre:');
        const apellidoLabel = screen.getByText('Apellido:');
        const emailLabel = screen.getByText('Email:');
        const paisLabel = screen.getByText('País:');

        // Find the closest input to each label
        const nombreInput = nombreLabel.parentElement?.querySelector('input');
        const apellidoInput = apellidoLabel.parentElement?.querySelector('input');
        const emailInput = emailLabel.parentElement?.querySelector('input');
        const paisInput = paisLabel.parentElement?.querySelector('input');
        
        // Fill the form
        fireEvent.change(nombreInput!, { target: { value: 'Jane' } });
        fireEvent.change(apellidoInput!, { target: { value: 'Smith' } });
        fireEvent.change(emailInput!, { target: { value: 'jane.smith@example.com' } });
        fireEvent.change(paisInput!, { target: { value: 'Canada' } });

        // Submit the form
        fireEvent.click(screen.getByText('Guardar'));

        // Expect onSave to be called with the correct data
        expect(mockOnSave).toHaveBeenCalledTimes(1);
        expect(mockOnSave).toHaveBeenCalledWith({
            name: { title: 'Mr', first: 'Jane', last: 'Smith' },
            email: 'jane.smith@example.com',
            location: { country: 'Canada' }
        });
    });

    it('should show validation errors when form is submitted with empty fields', () => {
        render(
            <UserModal
                isOpen={true}
        mode="add"
        user={null}
        onClose={mockOnClose}
        onSave={mockOnSave}
        />
    );

        // Submit the form without filling it
        fireEvent.click(screen.getByText('Guardar'));

        // Check for validation errors
        expect(screen.getByText('El nombre es obligatorio')).toBeInTheDocument();
        expect(screen.getByText('El apellido es obligatorio')).toBeInTheDocument();
        expect(screen.getByText('El email es obligatorio')).toBeInTheDocument();
        expect(screen.getByText('El país es obligatorio')).toBeInTheDocument();

        // Ensure onSave is not called
        expect(mockOnSave).not.toHaveBeenCalled();
    });

    it('should show email validation error when an invalid email is entered', () => {
        render(
            <UserModal
                isOpen={true}
                mode="add"
                user={null}
                onClose={mockOnClose}
                onSave={mockOnSave}
            />
        );

        // Find inputs by their surrounding labels
        const nombreLabel = screen.getByText('Nombre:');
        const apellidoLabel = screen.getByText('Apellido:');
        const emailLabel = screen.getByText('Email:');
        const paisLabel = screen.getByText('País:');

        // Find the closest input to each label
        const nombreInput = nombreLabel.parentElement?.querySelector('input');
        const apellidoInput = apellidoLabel.parentElement?.querySelector('input');
        const emailInput = emailLabel.parentElement?.querySelector('input');
        const paisInput = paisLabel.parentElement?.querySelector('input');

        // Fill the form with invalid email
        fireEvent.change(nombreInput!, { target: { value: 'Jane' } });
        fireEvent.change(apellidoInput!, { target: { value: 'Smith' } });
        fireEvent.change(emailInput!, { target: { value: 'invalid-email' } });
        fireEvent.change(paisInput!, { target: { value: 'Canada' } });

        // Submit the form
        fireEvent.click(screen.getByText('Guardar'));

        // Ensure onSave is not called
        expect(mockOnSave).not.toHaveBeenCalled();
    });
});