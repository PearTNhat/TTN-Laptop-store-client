import ImageWithFallback from "~/components/ImageWithFallback";

function ColorSelector({ product, colorProduct, setColorProduct }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
          <p className="font-bold text-gray-800 text-lg">Phiên bản:</p>
        </div>
        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-sm font-medium">
          {colorProduct.config
            ? `${colorProduct.config.ramValue} | ${colorProduct.config.hardDriveValue}`
            : "Chưa chọn"}
        </span>
      </div>

      <div className="flex flex-wrap gap-3">
        {product?.map((item) => {
          const config = item.config;
          console.log("config:", config, "selectedProduct:", colorProduct);
          return (
            <div
              key={item.id}
              className={`group relative flex flex-col gap-2 border-2 rounded-xl p-3 transition-all duration-300 cursor-pointer hover:scale-105 min-w-[160px] ${
                item.id === colorProduct.id
                  ? "border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg ring-4 ring-blue-200"
                  : "border-gray-200 hover:border-gray-400 bg-white hover:shadow-md"
              }`}
              onClick={() => setColorProduct(item)}
            >
              <ImageWithFallback
                src={item.thumbnail}
                alt={`${config?.ramValue} - ${config?.hardDriveValue}`}
                className="w-20 h-20 mx-auto rounded-lg object-cover shadow-sm"
                fallbackSrc="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iOCIgZmlsbD0iI0Y5RkFGQiIvPgo8cGF0aCBkPSJNMjQgMzJDMjggMzIgMzEuNSAyOC41IDMxLjUgMjRDMzEuNSAxOS41IDI4IDE2IDI0IDE2QzIwIDE2IDE2LjUgMTkuNSAxNi41IDI0QzE2LjUgMjguNSAyMCAzMiAyNCAzMloiIGZpbGw9IiNFNUU3RUIiLz4KPHBhdGggZD0iTTI0IDI4QzI2LjIwOTEgMjggMjggMjYuMjA5MSAyOCAyNEMyOCAyMS43OTA5IDI2LjIwOTEgMjAgMjQgMjBDMjEuNzkwOSAyMCAyMCAyMS43OTA5IDIwIDI0QzIwIDI2LjIwOTEgMjEuNzkwOSAyOCAyNCAyOFoiIGZpbGw9IiNEMUQ1REIiLz4KPC9zdmc+"
              />
              <div className="text-center">
                <div className="font-semibold text-gray-800 mb-1">
                  {config?.ramValue || "N/A"} |{" "}
                  {config?.hardDriveValue || "N/A"}
                </div>
                <div className="text-xs text-gray-500">
                  {item.color?.name && (
                    <span
                      className="inline-block w-3 h-3 rounded-full mr-1"
                      style={{ backgroundColor: item.color.hex }}
                    ></span>
                  )}
                  {item.color?.name}
                </div>
              </div>
              {item.id === colorProduct?.id && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ColorSelector;
