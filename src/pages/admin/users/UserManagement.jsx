import React, { useState, useMemo, useEffect } from "react";
import { FaUsers, FaUsersCog } from "react-icons/fa";

// Import các component con
import UserActions from "./components/UserAction";
import UserTable from "./components/UserTable";
import ModalWrapper from "./modal/ModallWrapper";
import UserDetail from "./components/UserDetail";
import ChangeUserRoleModal from "./modal/UserFormModal"; // modal đổi role
import ConfirmationModal from "./modal/ConfirmationModal";
import Pagination from "~/components/pagination/Pagination";

import { ToastContainer, toast } from "react-toastify";
import { apiDeleteUser } from "~/apis/userApi";

import { useSelector } from "react-redux";
import { apiGetUsers } from "~/apis/usersmanagementApi";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const { accessToken } = useSelector((state) => state.user);

  // State cho modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // 'view', 'edit', 'block'
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await apiGetUsers({
        page: 0,
        size: 9999,
        search: "",
        accessToken
      });
      console.log("API Users:", res.content);
      setUsers(res.content);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openModal = (type, user = null) => {
    setModalType(type);
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(null);
    setSelectedUser(null);
  };

  // Cập nhật role của user trong UI sau khi đổi
  const handleUpdateUserRole = (userId, newRoleId, allRoles) => {
    const foundRole = allRoles.find((r) => r.value === newRoleId);
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              roles: [
                {
                  id: newRoleId,
                  description: foundRole ? foundRole.label : newRoleId
                }
              ]
            }
          : u
      )
    );
  };

  const handleDeleteUser = async () => {
  if (!selectedUser) return;

  const res = await apiDeleteUser({ userId: selectedUser.id, accessToken });
  if (res.success) {
    toast.success(res.message);
    setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
  } else {
    toast.error(res.message);
  }
  closeModal();
};
  // Mở khóa / Khóa người dùng
  // const handleToggleBlockUser = () => {
  //   setUsers(
  //     users.map((user) =>
  //       user.id === selectedUser.id
  //         ? { ...user, blocked: !user.blocked }
  //         : user
  //     )
  //   );
  //   closeModal();
  // };

  // Lọc danh sách
  const filteredUsers = useMemo(
    () =>
      users.filter((user) => {
        const fullName = `${user.lastName || ""} ${user.firstName || ""}`
          .toLowerCase()
          .trim();
        const search = searchTerm.toLowerCase().trim();
        return (
          fullName.includes(search) ||
          (user.email && user.email.toLowerCase().includes(search)) ||
          (user.phoneNumber && user.phoneNumber.includes(search))
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
      <ToastContainer position="top-right" autoClose={3000} />
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
            <FaUsersCog className="text-gray-400" />
            <span>Tổng: {users.length} người dùng</span>
          </div>
        </div>
      </div>

      <UserActions
        searchTerm={searchTerm}
        onSearchChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
        onAddClick={() => openModal("add")}
      />

      <div className="shadow-md rounded-xl">
        <UserTable
          users={currentUsers}
          onView={(user) => openModal("view", user)}
          onEdit={(user) => openModal("edit", user)} // đổi role
          onBlock={(user) => openModal("block", user)}
          onDelete={(user) => openModal("delete", user)}
        />
        <div className="py-2">
          <Pagination
            currentPage={currentPage}
            totalPageCount={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>

      {/* --- MODALS --- */}
      {isModalOpen && (
        <ModalWrapper onClose={closeModal}>
          {modalType === "view" && (
            <UserDetail user={selectedUser} onClose={closeModal} />
          )}

          {modalType === "edit" && (
            <ChangeUserRoleModal
              user={selectedUser}
              onClose={closeModal}
              onSuccess={(userId, roleId, roleOptions) =>
                handleUpdateUserRole(userId, roleId, roleOptions)
              }
            />
          )}

          {modalType === "delete" && (
            <ConfirmationModal
              title="Xác nhận xóa"
              message={`Bạn có chắc chắn muốn xóa tài khoản của ${selectedUser?.lastName} ${selectedUser?.firstName}?`}
              onConfirm={handleDeleteUser}
              onClose={closeModal}
              confirmText="Xóa"
              confirmColor="red"
            />
          )}
        </ModalWrapper>
      )}
    </div>
  );
}

export default UserManagement;
