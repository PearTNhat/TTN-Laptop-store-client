import { IoClose } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { modalActions } from "~/stores/slice/modal";

function DetailInfoModal({ configs }) {
  const dispatch = useDispatch();
  return (
    <div
      className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header với gradient đẹp */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-2">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="font-bold text-3xl flex items-center gap-3">
              <span className="text-4xl">📋</span>
              Thông số kỹ thuật chi tiết
            </h2>
          </div>
          <button
            onClick={() =>
              dispatch(
                modalActions.toggleModal({
                  isShowModal: false,
                  childrenModal: null,
                })
              )
            }
            className="text-white hover:text-red-300 transition-all duration-300 rounded-full p-3 hover:bg-white/20 group"
          >
            <IoClose
              size={28}
              className="group-hover:rotate-90 transition-transform duration-300"
            />
          </button>
        </div>
      </div>

      {/* Content với scroll đẹp */}
      <div className="p-8 overflow-y-auto max-h-[70vh] bg-gradient-to-br from-gray-50 to-white">
        <div className="grid gap-4">
          {configs?.map((config, index) => (
            <div
              className={`group flex justify-between gap-6 p-5 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-l-4 ${
                index % 3 === 0
                  ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-500"
                  : index % 3 === 1
                  ? "bg-gradient-to-r from-purple-50 to-pink-50 border-purple-500"
                  : "bg-gradient-to-r from-green-50 to-emerald-50 border-green-500"
              }`}
              key={config.name}
            >
              <div className="flex items-center gap-3 w-1/3">
                <span
                  className={`w-3 h-3 rounded-full ${
                    index % 3 === 0
                      ? "bg-blue-500"
                      : index % 3 === 1
                      ? "bg-purple-500"
                      : "bg-green-500"
                  }`}
                ></span>
                <span className="font-bold text-gray-800 group-hover:text-gray-900">
                  {config.name}
                </span>
              </div>
              <span
                className="w-2/3 text-gray-700 font-medium group-hover:text-gray-900"
                dangerouslySetInnerHTML={{ __html: config.description }}
              ></span>
            </div>
          ))}
        </div>

        {/* Footer với thống kê */}
        <div className="mt-8 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl p-6 text-center">
          <div className="flex items-center justify-center gap-4 text-gray-600">
            <span className="flex items-center gap-2">
              <span className="text-2xl">📊</span>
              <span className="font-semibold">
                Tổng cộng: {configs?.length} thông số
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailInfoModal;
