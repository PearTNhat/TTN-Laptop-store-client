import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { PencilSquareIcon, UserIcon, EnvelopeIcon, PhoneIcon, CalendarIcon, MapPinIcon } from '@heroicons/react/24/outline';

const ProfileInfo = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@gmail.com',
    phone: '0123 456 789',
    dob: '01/01/2000',
    address: '123 Đường ABC, Quận 1, TP.HCM',
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // Xử lý lưu thông tin ở đây (gửi API, v.v.)
    setIsOpen(false);
  };

  const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
      <div className="w-full sm:w-1/3 text-gray-500 text-sm font-medium flex items-center">
        <Icon className="w-4 h-4 mr-2" />
        {label}
      </div>
      <div className="w-full sm:w-2/3">
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
          <p className="text-gray-900 font-medium">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <UserIcon className="w-5 h-5 mr-2 text-blue-500" />
          Thông tin cá nhân
        </h2>
      </div>

      <div className="space-y-6">
        <InfoRow icon={UserIcon} label="Họ tên" value={profile.name} />
        <InfoRow icon={EnvelopeIcon} label="Email" value={profile.email} />
        <InfoRow icon={PhoneIcon} label="Số điện thoại" value={profile.phone} />
        <InfoRow icon={CalendarIcon} label="Ngày sinh" value={profile.dob} />
        <InfoRow icon={MapPinIcon} label="Địa chỉ" value={profile.address} />

        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button
            onClick={() => setIsOpen(true)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-5 rounded-lg transition duration-200 flex items-center"
          >
            <PencilSquareIcon className="w-4 h-4 mr-2" />
            Chỉnh sửa thông tin
          </button>
        </div>
      </div>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-xl w-full max-w-lg p-6 shadow-xl">
            <Dialog.Title className="text-lg font-bold text-gray-800 mb-4">Chỉnh sửa thông tin</Dialog.Title>
            <div className="space-y-4">
              {['name', 'email', 'phone', 'dob', 'address'].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-600 capitalize">
                    {field === 'dob' ? 'Ngày sinh' : field === 'name' ? 'Họ tên' : field === 'phone' ? 'Số điện thoại' : field}
                  </label>
                  <input
                    type="text"
                    name={field}
                    value={profile[field]}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setIsOpen(false)} className="px-4 py-2 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300">
                Hủy
              </button>
              <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Lưu
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default ProfileInfo;

