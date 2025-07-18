import { modalActions } from "~/stores/slice/modal";
import DetailInfoModal from "./DetailInfoModal";
import { useDispatch } from "react-redux";
import { capitalizeFirstCharacter } from "~/utils/helper";

function DetailInfo({ configs }) {
  const dispatch = useDispatch();
  // Chuyển đổi object configs thành mảng và sắp xếp
  let configsArr = Object.entries(configs || {}).filter(
    ([key, value]) =>
      key !== "ramValue" &&
      key !== "hardDriveValue" &&
      key !== "id" &&
      key !== "productDetailId" &&
      Boolean(value)
  );
  console.log("DetailInfo configs:", configsArr);
  // Lấy ra một số thông tin ngắn gọn để hiển thị
  const shortInfo = configsArr.slice(0, 6);

  const handleClickViewDetail = () => {
    console.log("Clicked view detail with configs:", configsArr);
    dispatch(
      modalActions.toggleModal({
        isShowModal: true,
        animation: true,
        childrenModal: <DetailInfoModal configs={configsArr} />,
      })
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      {/* Header với gradient đẹp */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-2">
        <h2 className="font-bold text-xl flex items-center gap-3">
          <span className="text-xl">⚙️</span>
          Thông số kỹ thuật
        </h2>
      </div>

      {/* Content với style hiện đại */}
      <div className="p-6">
        <div className="space-y-3">
          {shortInfo?.map((config, index) => (
            <div
              className={`group flex justify-between gap-4 p-4 rounded-xl transition-all duration-300 hover:shadow-md hover:scale-[1.02] ${
                index % 2 === 0
                  ? "bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100"
                  : "bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100"
              }`}
              key={config[0]}
            >
              <span className="font-semibold text-gray-700 flex-shrink-0 flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    index % 2 === 0 ? "bg-blue-500" : "bg-purple-500"
                  }`}
                ></span>
                {capitalizeFirstCharacter(config[0])}
              </span>
              <span
                className="text-right text-gray-800 font-medium group-hover:text-gray-900"
                dangerouslySetInnerHTML={{ __html: config[1] }}
              ></span>
            </div>
          ))}
        </div>
      </div>
      {/* Button xem chi tiết với thiết kế đẹp */}
      <div className="px-6 pb-6">
        <button
          onClick={handleClickViewDetail}
          className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 group"
        >
          <span className="text-xl group-hover:rotate-12 transition-transform duration-300">
            🔍
          </span>
          <span className="text-lg">Xem chi tiết đầy đủ</span>
          <span className="text-xl group-hover:translate-x-1 transition-transform duration-300">
            →
          </span>
        </button>
      </div>
    </div>
  );
}

export default DetailInfo;
