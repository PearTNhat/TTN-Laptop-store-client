// src/pages/UserManagement.js
import React, { useState, useMemo } from "react";
import { FaUsers, FaUsersCog } from "react-icons/fa";

// Import các component con
import UserActions from "./components/UserAction";
import UserTable from "./components/UserTable";
import ModalWrapper from "./modal/ModallWrapper";
import ViewUserModal from "./modal/ViewUserModal";
import UserFormModal from "./modal/UserFormModal";
import ConfirmationModal from "./modal/ConfirmationModal";
import { initialUsers } from "~/constants/mockUsers";
import Pagination from "~/components/pagination/Pagination";

function UserManagement() {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // State cho modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // 'view', 'add', 'edit', 'delete', 'block'
  const [selectedUser, setSelectedUser] = useState(null);

  // --- Handlers for opening modals ---
  const openModal = (type, user = null) => {
    setModalType(type);

    // Đảm bảo user có đúng format roles cho edit mode
    if (user && (type === "edit" || type === "view")) {
      const userWithRoles = {
        ...user,
        roles: user.roles || (user.role ? [user.role] : ["User"]),
      };
      setSelectedUser(userWithRoles);
    } else {
      setSelectedUser(user);
    }

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(null);
    setSelectedUser(null);
  };

  // --- CRUD and other logic functions ---
  const handleAddUser = (newUser) => {
    const userWithId = {
      ...newUser,
      id: Date.now(),
      joinDate: new Date().toISOString().split("T")[0],
      blocked: false,
      avatar: null,
      // Chuyển đổi roles array thành role string để tương thích với dữ liệu cũ
      role:
        newUser.roles && newUser.roles.length > 0 ? newUser.roles[0] : "User",
      roles: newUser.roles || ["User"], // Giữ lại array cho tương lai
    };
    setUsers([userWithId, ...users]);
    closeModal();
  };

  const handleEditUser = (updatedUser) => {
    const userWithUpdatedRole = {
      ...updatedUser,
      // Chuyển đổi roles array thành role string để tương thích với dữ liệu cũ
      role:
        updatedUser.roles && updatedUser.roles.length > 0
          ? updatedUser.roles[0]
          : "User",
      roles: updatedUser.roles || ["User"], // Giữ lại array cho tương lai
    };
    setUsers(
      users.map((user) =>
        user.id === updatedUser.id ? userWithUpdatedRole : user
      )
    );
    closeModal();
  };

  const handleDeleteUser = () => {
    setUsers(users.filter((user) => user.id !== selectedUser.id));
    closeModal();
  };

  const handleToggleBlockUser = () => {
    setUsers(
      users.map((user) =>
        user.id === selectedUser.id ? { ...user, blocked: !user.blocked } : user
      )
    );
    closeModal();
  };

  // --- Filtering and Pagination Logic ---
  const filteredUsers = useMemo(
    () =>
      users.filter((user) => {
        const fullName = `${user.last_name} ${user.first_name}`.toLowerCase();
        const search = searchTerm.toLowerCase();
        return (
          fullName.includes(search) || user.email.toLowerCase().includes(search)
        );
      }),
    [users, searchTerm]
  );

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen font-sans">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
            <FaUsers className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Quản lý người dùng
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>{users.filter((u) => !u.blocked).length} đang hoạt động</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span>{users.filter((u) => u.blocked).length} bị khóa</span>
          </div>
          <div className="flex items-center gap-2">
            <FaUsersCog className="text-gray-400" />
            <span>Tổng: {users.length} người dùng</span>
          </div>
        </div>
      </div>

      <UserActions
        searchTerm={searchTerm}
        onSearchChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1); // Reset to first page on search
        }}
        onAddClick={() => openModal("add")}
      />

      <div className="shadow-md rounded-xl">
        <UserTable
          users={currentUsers}
          onView={(user) => openModal("view", user)}
          onEdit={(user) => openModal("edit", user)}
          onBlock={(user) => openModal("block", user)}
          onDelete={(user) => openModal("delete", user)}
        />
        <div className="py-2">
          <Pagination
            currentPage={currentPage}
            totalPageCount={5}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>

      {/* --- RENDER MODALS --- */}
      {isModalOpen && (
        <ModalWrapper onClose={closeModal}>
          {modalType === "view" && (
            <ViewUserModal user={selectedUser} onClose={closeModal} />
          )}
          {(modalType === "add" || modalType === "edit") && (
            <UserFormModal
              onClose={closeModal}
              onSave={modalType === "add" ? handleAddUser : handleEditUser}
              user={modalType === "edit" ? selectedUser : null}
            />
          )}
          {modalType === "delete" && (
            <ConfirmationModal
              title="Xác nhận xóa"
              message={`Bạn có chắc chắn muốn xóa người dùng ${selectedUser.last_name} ${selectedUser.first_name}? Hành động này không thể hoàn tác.`}
              onConfirm={handleDeleteUser}
              onClose={closeModal}
              confirmText="Xóa"
              confirmColor="red"
            />
          )}
          {modalType === "block" && (
            <ConfirmationModal
              title={
                selectedUser.blocked ? "Xác nhận mở khóa" : "Xác nhận khóa"
              }
              message={`Bạn có chắc chắn muốn ${
                selectedUser.blocked ? "mở khóa" : "khóa"
              } tài khoản của ${selectedUser.last_name} ${
                selectedUser.first_name
              }?`}
              onConfirm={handleToggleBlockUser}
              onClose={closeModal}
              confirmText={selectedUser.blocked ? "Mở khóa" : "Khóa"}
              confirmColor="orange"
            />
          )}
        </ModalWrapper>
      )}
    </div>
  );
}

export default UserManagement;
