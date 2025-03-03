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

export type UserModalMode = 'add' | 'edit';