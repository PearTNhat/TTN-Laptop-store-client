import React, { useState, useMemo, useEffect, useCallback } from "react";
import { FaUsers, FaUsersCog } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";

// Import các component con
import UserActions from "./components/UserAction";
import UserTable from "./components/UserTable";
import ModalWrapper from "./modal/ModallWrapper";
import UserDetail from "./components/UserDetail";
import ChangeUserRoleModal from "./modal/UserFormModal"; // modal đổi role
import ConfirmationModal from "./modal/ConfirmationModal";
import Pagination from "~/components/pagination/Pagination";

import { ToastContainer, toast } from "react-toastify";
import { apiDeleteUser, apiGetAllUsers } from "~/apis/userApi";
import { useSelector } from "react-redux";
import { showToastError } from "~/utils/alert";

function UserManagement() {
  const { accessToken } = useSelector((state) => state.user);
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  const currentParams = useMemo(
    () => Object.fromEntries([...searchParams]),
    [searchParams]
  );

  const usersPerPage = 10;

  // State cho modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // 'view', 'edit', 'block'
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiGetAllUsers({
        accessToken,
        page: parseInt(currentParams.page) || 1,
        size: usersPerPage,
        keyword: currentParams.q || undefined,
      });

      if (response.code === 200) {
        console.log(response.data);
        setUsers(response.data.content || []);
        setPagination({
          currentPage: response.data.pageNumber + 1,
          totalPages: response.data.totalPages || 1,
        });
      } else {
        throw new Error(response.message || "Failed to load users");
      }
    } catch (error) {
      showToastError(
        error.message || "Không thể tải người dùng. Vui lòng thử lại."
      );
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, currentParams.page, currentParams.q, usersPerPage]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Xử lý search với debounce
  const handleSearchChange = useCallback(
    (searchValue) => {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        if (searchValue.trim()) {
          newParams.set("q", searchValue.trim());
          newParams.set("page", "1"); // Reset về trang 1 khi search
        } else {
          newParams.delete("q");
        }
        return newParams;
      });
    },
    [setSearchParams]
  );

  // Xử lý pagination
  const handlePageChange = (page) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("page", page.toString());
      return newParams;
    });
  };
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
                  description: foundRole ? foundRole.label : newRoleId,
                },
              ],
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
        searchTerm={currentParams.q || ""}
        onSearchChange={(e) => {
          handleSearchChange(e.target.value);
        }}
        onAddClick={() => openModal("add")}
      />

      <div className="shadow-md rounded-xl">
        <UserTable
          users={users}
          isLoading={isLoading}
          onView={(user) => openModal("view", user)}
          onEdit={(user) => openModal("edit", user)} // đổi role
          onBlock={(user) => openModal("block", user)}
          onDelete={(user) => openModal("delete", user)}
        />
        <div className="py-2">
          <Pagination
            currentPage={pagination.currentPage}
            totalPageCount={pagination.totalPages}
            onPageChange={handlePageChange}
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
