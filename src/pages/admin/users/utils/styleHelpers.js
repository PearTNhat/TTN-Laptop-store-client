// src/pages/admin/users/utils/styleHelpers.js

export const getStatusColor = (blocked) => {
    return blocked
        ? 'bg-red-100 text-red-800'
        : 'bg-green-100 text-green-800';
};

export const getRoleColor = (role) => {
    const colors = {
        'Admin': 'bg-purple-100 text-purple-800',
        'Moderator': 'bg-blue-100 text-blue-800',
        'User': 'bg-gray-100 text-gray-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
};
