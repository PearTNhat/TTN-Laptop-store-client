// Ví dụ sử dụng ConfirmModal trong các component khác

import ConfirmModal from '../components/modal/ConfirmModal';

// 1. Modal xác nhận cơ bản
const handleDelete = async () => {
    const result = await ConfirmModal.delete({
        title: 'Xóa sản phẩm',
        text: 'Bạn có chắc chắn muốn xóa sản phẩm này?'
    });

    if (result.isConfirmed) {
        // Thực hiện xóa
        console.log('Deleted');
    }
};

// 2. Modal với input
const handleReject = async () => {
    const result = await ConfirmModal.withInput({
        title: 'Từ chối đơn hàng',
        text: 'Vui lòng nhập lý do từ chối:',
        inputPlaceholder: 'Nhập lý do...'
    });

    if (result.isConfirmed) {
        console.log('Reason:', result.value);
    }
};

// 3. Modal với select
const handleUpdateStatus = async () => {
    const result = await ConfirmModal.withSelect({
        title: 'Cập nhật trạng thái',
        inputOptions: {
            'pending': 'Chờ xác nhận',
            'confirmed': 'Đã xác nhận',
            'shipped': 'Đã giao'
        }
    });

    if (result.isConfirmed) {
        console.log('New status:', result.value);
    }
};

// 4. Toast notification
const showSuccess = () => {
    ConfirmModal.toast({
        icon: 'success',
        title: 'Cập nhật thành công!'
    });
};

// 5. Modal thành công
const showSuccessModal = async () => {
    await ConfirmModal.success({
        title: 'Thành công!',
        text: 'Dữ liệu đã được lưu thành công.'
    });
};

// 6. Modal lỗi
const showError = async () => {
    await ConfirmModal.error({
        title: 'Lỗi!',
        text: 'Có lỗi xảy ra khi xử lý yêu cầu.'
    });
};

export {
    handleDelete,
    handleReject,
    handleUpdateStatus,
    showSuccess,
    showSuccessModal,
    showError
};
