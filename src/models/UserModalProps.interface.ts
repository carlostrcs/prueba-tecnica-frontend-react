import {User, UserModalMode} from "./user.interface.ts";

export interface UserModalProps {
    isOpen: boolean;
    mode: UserModalMode;
    user: User | null;
    onClose: () => void;
    onSave: (userData: Partial<User>) => void;
}