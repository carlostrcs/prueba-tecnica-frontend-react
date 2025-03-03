import React from 'react';
import {UserTableProps} from "../models/UserTableProps.interface.ts";

const UserTable: React.FC<UserTableProps> = ({ users, onDelete, onEdit }) => {
    return (
        <table>
            <thead>
            <tr>
                <th>Imagen</th>
                <th>Nombre Completo</th>
                <th>Email</th>
                <th>País</th>
                <th>Acciones</th>
            </tr>
            </thead>
            <tbody>
            {users.map(user => (
                <tr key={user.login.uuid}>
                    <td>
                        <img
                            src={user.picture.thumbnail}
                            alt={`${user.name.first} ${user.name.last}`}
                        />
                    </td>
                    <td>{`${user.name.title} ${user.name.first} ${user.name.last}`}</td>
                    <td>{user.email}</td>
                    <td>{user.location.country}</td>
                    <td>
                        <button className="actions" onClick={() => onEdit(user)}>Editar</button>
                        <button className="actions" onClick={() => onDelete(user.login.uuid)}>Eliminar</button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default UserTable;
