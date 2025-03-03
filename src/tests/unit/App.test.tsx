import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../../App';
import { userService } from '../../services/userService';
import '@testing-library/jest-dom';

// Mock userService
jest.mock('../../services/userService', () => ({
    userService: {
        fetchUsers: jest.fn(),
        createUser: jest.fn(),
        updateUser: jest.fn()
    }
}));

// Sample users for testing
const mockUsers = [
    {
        login: { uuid: '123' },
        name: { title: 'Mr', first: 'John', last: 'Doe' },
        email: 'john.doe@example.com',
        picture: {
            thumbnail: 'thumb1.jpg',
            medium: 'medium1.jpg',
            large: 'large1.jpg',
        },
        location: { country: 'USA' },
    },
    {
        login: { uuid: '456' },
        name: { title: 'Ms', first: 'Jane', last: 'Smith' },
        email: 'jane.smith@example.com',
        picture: {
            thumbnail: 'thumb2.jpg',
            medium: 'medium2.jpg',
            large: 'large2.jpg',
        },
        location: { country: 'Canada' },
    }
];

describe('App Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (userService.fetchUsers as jest.Mock).mockResolvedValue(mockUsers);
    });

    it('should render the component and fetch users on mount', async () => {
        render(<App />);

        // Check for loading state
        expect(screen.getByText('Cargando usuarios...')).toBeInTheDocument();

        // Wait for users to load
        await waitFor(() => {
            expect(userService.fetchUsers).toHaveBeenCalledTimes(1);
            expect(userService.fetchUsers).toHaveBeenCalledWith(100);
        });

        // Check if users are displayed
        await waitFor(() => {
            expect(screen.getByText('Mr John Doe')).toBeInTheDocument();
            expect(screen.getByText('Ms Jane Smith')).toBeInTheDocument();
        });
    });

    it('should handle API errors gracefully', async () => {
        (userService.fetchUsers as jest.Mock).mockRejectedValueOnce(new Error('API error'));

        render(<App />);

        await waitFor(() => {
            expect(screen.getByText('Failed to load users. Please try again later.')).toBeInTheDocument();
        });
    });

    it('should open add user modal when Add button is clicked', async () => {
        render(<App />);

        // Wait for users to load
        await waitFor(() => {
            expect(screen.getByText('Mr John Doe')).toBeInTheDocument();
        });

        // Click Add button
        fireEvent.click(screen.getByText('Añadir'));

        // Check if modal is opened
        expect(screen.getByText('Añadir Usuario')).toBeInTheDocument();
    });

    it('should add a new user when form is submitted', async () => {
        const newUser = {
            login: { uuid: '789' },
            name: { title: 'Mr', first: 'New', last: 'User' },
            email: 'new.user@example.com',
            picture: {
                thumbnail: 'newthumb.jpg',
                medium: 'newmedium.jpg',
                large: 'newlarge.jpg',
            },
            location: { country: 'UK' },
        };

        (userService.createUser as jest.Mock).mockReturnValueOnce(newUser);

        render(<App />);

        // Wait for users to load
        await waitFor(() => {
            expect(screen.getByText('Mr John Doe')).toBeInTheDocument();
        });

        // Click Add button
        fireEvent.click(screen.getByText('Añadir'));

        // Fill the form
        fireEvent.change(screen.getByLabelText('Nombre:'), { target: { value: 'New' } });
        fireEvent.change(screen.getByLabelText('Apellido:'), { target: { value: 'User' } });
        fireEvent.change(screen.getByLabelText('Email:'), { target: { value: 'new.user@example.com' } });
        fireEvent.change(screen.getByLabelText('País:'), { target: { value: 'UK' } });

        // Submit the form
        fireEvent.click(screen.getByText('Guardar'));

        // Check if userService.createUser was called
        expect(userService.createUser).toHaveBeenCalledWith({
            name: { title: 'Mr', first: 'New', last: 'User' },
            email: 'new.user@example.com',
            location: { country: 'UK' }
        });

        // Check if the new user is in the table
        await waitFor(() => {
            expect(screen.getByText('Mr New User')).toBeInTheDocument();
        });
    });

    it('should edit a user when edit button is clicked and form submitted', async () => {
        const updatedUser = {
            ...mockUsers[0],
            name: { ...mockUsers[0].name, first: 'Updated' },
            email: 'updated.doe@example.com'
        };

        (userService.updateUser as jest.Mock).mockReturnValueOnce(updatedUser);

        render(<App />);

        // Wait for users to load
        await waitFor(() => {
            expect(screen.getByText('Mr John Doe')).toBeInTheDocument();
        });

        // Find and click Edit button for the first user
        const editButtons = screen.getAllByText('Editar');
        fireEvent.click(editButtons[0]);

        // Check if modal is opened with user data
        expect(screen.getByText('Editar Usuario')).toBeInTheDocument();
        expect(screen.getByLabelText('Nombre:').getAttribute('value')).toBe('John');

        // Change form values
        fireEvent.change(screen.getByLabelText('Nombre:'), { target: { value: 'Updated' } });
        fireEvent.change(screen.getByLabelText('Email:'), { target: { value: 'updated.doe@example.com' } });

        // Submit the form
        fireEvent.click(screen.getByText('Guardar'));

        // Check if userService.updateUser was called
        expect(userService.updateUser).toHaveBeenCalled();

        // Check if the updated user is in the table
        await waitFor(() => {
            expect(screen.getByText('Mr Updated Doe')).toBeInTheDocument();
            expect(screen.getByText('updated.doe@example.com')).toBeInTheDocument();
        });
    });

    it('should delete a user when delete button is clicked', async () => {
        render(<App />);

        // Wait for users to load
        await waitFor(() => {
            expect(screen.getByText('Mr John Doe')).toBeInTheDocument();
            expect(screen.getByText('Ms Jane Smith')).toBeInTheDocument();
        });

        // Find and click Delete button for the first user
        const deleteButtons = screen.getAllByText('Eliminar');
        fireEvent.click(deleteButtons[0]);

        // Check if the user is removed from the table
        await waitFor(() => {
            expect(screen.queryByText('Mr John Doe')).not.toBeInTheDocument();
            expect(screen.getByText('Ms Jane Smith')).toBeInTheDocument();
        });
    });

    it('should restore original users when Restore button is clicked', async () => {
        render(<App />);

        // Wait for users to load
        await waitFor(() => {
            expect(screen.getByText('Mr John Doe')).toBeInTheDocument();
        });

        // Delete a user
        const deleteButtons = screen.getAllByText('Eliminar');
        fireEvent.click(deleteButtons[0]);

        // Check if the user is removed
        await waitFor(() => {
            expect(screen.queryByText('Mr John Doe')).not.toBeInTheDocument();
        });

        // Click Restore button
        fireEvent.click(screen.getByText('Restaurar'));

        // Check if all users are restored
        await waitFor(() => {
            expect(screen.getByText('Mr John Doe')).toBeInTheDocument();
            expect(screen.getByText('Ms Jane Smith')).toBeInTheDocument();
        });
    });
});