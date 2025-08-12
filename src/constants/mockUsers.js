// src/data/mockUsers.js

export const initialUsers = [
    {
    id: "19bfc60a-1d73-404d-8213-ce0edba68b45",
    firstName: "Super",
    lastName: "Admin",
    email: null,
    phoneNumber: "123",
    dob: "11/12/2003",
    gender: "Nam",
    roles: [
      {
        id: "ADMIN",
        description: "Quản trị viên hệ thống",
        permission: [
          {
            id: "OWNER",
            description: "Toàn quyền truy cập"
          }
        ],
        color: "#dc2626" // đỏ
      }
    ],
    avatar: "http://res.cloudinary.com/drj1pwnjs/image/upload/v1754795242/avatar/ybmvo992h5dg5sg2tqmp.png",
    address: [
      {
        id: 7,
        address: "Huyện Hóc Môn, TP.HCM",
        phone: "123",
        recipient: "Super Admin",
        default: true
      }
    ],
    amountUsed: 0
  },
  {
    id: "e4dbf153-beba-4d63-aa60-26ba5fec3944",
    firstName: "D21CQCN02-N",
    lastName: "MAI VAN HUY",
    email: null,
    phoneNumber: null,
    dob: null,
    gender: null,
    roles: [
      {
        id: "CUSTOMER",
        description: "Khách hàng",
        permission: [
          {
            id: "USER",
            description: "Người dùng cơ bản"
          }
        ],
        color: "#059669" // xanh lá
      }
    ],
    avatar: null,
    address: [],
    amountUsed: 0
  },
  {
    id: "ca5f60fa-589f-409d-b7fe-76c4e5e8cab3",
    firstName: "1234",
    lastName: "luật",
    email: "n21dccn145@student.ptithcm.edu.vn",
    phoneNumber: "0968533555",
    dob: "10/02/2009",
    gender: "Khác",
    roles: [
      {
        id: "CUSTOMER",
        description: "Khách hàng",
        permission: [
          {
            id: "USER",
            description: "Người dùng cơ bản"
          }
        ],
        color: "#059669"
      }
    ],
    avatar: null,
    address: [
      {
        id: 25,
        address: "xóm 8, xã Nông thôn, huyện X",
        phone: "0968533555",
        recipient: "Luật",
        default: false
      }
    ],
    amountUsed: 0
  },
  {
    id: "58fd500c-d7ac-4062-bd5a-a53b90714e0b",
    firstName: "mai",
    lastName: "huy",
    email: "huydlx@gmail.com",
    phoneNumber: "0348859264",
    dob: "11/12/2003",
    gender: "Nam",
    roles: [
      {
        id: "CUSTOMER",
        description: "Khách hàng",
        permission: [
          {
            id: "USER",
            description: "Người dùng cơ bản"
          }
        ],
        color: "#059669"
      }
    ],
    avatar: null,
    address: [
      {
        id: 20,
        address: "Gia Lai",
        phone: "0348859264",
        recipient: "Mai Huy",
        default: true
      }
    ],
    amountUsed: 5320
  }
];


 // {
    //     id: 1,
    //     avatar: null,
    //     first_name: "Văn A",
    //     last_name: "Nguyễn",
    //     email: "nguyenvana@email.com",
    //     phone_number: "0912345678",
    //     dob: "1990-01-15",
    //     gender: "Nam",
    //     role: "Admin",
    //     blocked: false,
    //     joinDate: "2024-01-15",
    // },
    // {
    //     id: 2,
    //     avatar: "https://i.pravatar.cc/150?u=tranthib",
    //     first_name: "Thị B",
    //     last_name: "Trần",
    //     email: "tranthib@email.com",
    //     phone_number: "0987654321",
    //     dob: "1992-05-20",
    //     gender: "Nữ",
    //     role: "User",
    //     blocked: false,
    //     joinDate: "2024-01-14",
    // },
    // {
    //     id: 3,
    //     first_name: "Văn C",
    //     last_name: "Lê",
    //     avatar: null,
    //     email: "levanc@email.com",
    //     phone_number: "0911223344",
    //     dob: "1988-11-30",
    //     gender: "Nam",
    //     role: "User",
    //     blocked: true,
    //     joinDate: "2024-01-13",
    // },
    // Thêm các user khác nếu cần