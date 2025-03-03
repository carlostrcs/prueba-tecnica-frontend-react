import {User} from "./user.interface.ts";

export interface UserTableProps {
    users: User[];
    onDelete: (id: string) => void;
    onEdit: (user: User) => void;
}
