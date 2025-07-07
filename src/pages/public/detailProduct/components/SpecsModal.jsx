function SpecsModal({ isOpen, onClose, configs }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex items-center justify-between">
          <h2 className="font-bold text-2xl flex items-center gap-3">
            <span className="text-3xl">⚙️</span>
            Thông số kỹ thuật chi tiết
          </h2>
          <button
            onClick={onClose}
            className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors duration-200"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {configs && configs.length > 0 ? (
            <div className="space-y-6">
              {configs.map((config, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-xl p-6 border border-gray-200"
                >
                  <h3 className="font-bold text-xl text-gray-800 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    {config.name}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {config.specs?.map((spec, specIndex) => (
                      <div
                        key={specIndex}
                        className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-gray-600 font-medium">
                            {spec.name}:
                          </span>
                          <span className="text-gray-800 font-semibold text-right ml-2">
                            {spec.value}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <span className="text-6xl mb-4 block">📋</span>
              <p className="text-gray-500 text-lg">Chưa có thông số kỹ thuật</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SpecsModal;
