import {User} from "../models/user.interface.ts";

export const userService = {
    async fetchUsers(count: number = 100): Promise<User[]> {
        try {
            const response = await fetch(`https://randomuser.me/api/?results=${count}`);

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    },
    
    createUser(userData: Partial<User>): User {
        return {
            login: { uuid: Date.now().toString() },
            name: {
                title: userData.name?.title || 'Mr',
                first: userData.name?.first || '',
                last: userData.name?.last || ''
            },
            email: userData.email || '',
            picture: {
                thumbnail: 'https://via.placeholder.com/50',
                medium: 'https://via.placeholder.com/100',
                large: 'https://via.placeholder.com/150'
            },
            location: {
                country: userData.location?.country || ''
            }
        };
    },
    
    updateUser(originalUser: User, updatedData: Partial<User>): User {
        return {
            ...originalUser,
            ...updatedData,
            name: {
                ...originalUser.name,
                ...updatedData.name
            },
            location: {
                ...originalUser.location,
                ...updatedData.location
            }
        };
    }
};