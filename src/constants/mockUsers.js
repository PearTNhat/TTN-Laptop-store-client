// src/data/mockUsers.js

export const initialUsers = [
    {
        id: 1,
        avatar: null,
        first_name: "Văn A",
        last_name: "Nguyễn",
        email: "nguyenvana@email.com",
        phone_number: "0912345678",
        dob: "1990-01-15",
        gender: "Nam",
        role: "Admin",
        blocked: false,
        joinDate: "2024-01-15",
    },
    {
        id: 2,
        avatar: "https://i.pravatar.cc/150?u=tranthib",
        first_name: "Thị B",
        last_name: "Trần",
        email: "tranthib@email.com",
        phone_number: "0987654321",
        dob: "1992-05-20",
        gender: "Nữ",
        role: "User",
        blocked: false,
        joinDate: "2024-01-14",
    },
    {
        id: 3,
        first_name: "Văn C",
        last_name: "Lê",
        avatar: null,
        email: "levanc@email.com",
        phone_number: "0911223344",
        dob: "1988-11-30",
        gender: "Nam",
        role: "User",
        blocked: true,
        joinDate: "2024-01-13",
    },
    // Thêm các user khác nếu cần
];