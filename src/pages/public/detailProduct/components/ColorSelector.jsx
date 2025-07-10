import ImageWithFallback from "~/components/ImageWithFallback";

function ColorSelector({ product, colorProduct, setColorProduct }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
          <p className="font-bold text-gray-800 text-lg">Màu sắc:</p>
        </div>
        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-sm font-medium">
          {colorProduct.color || "Chưa chọn"}
        </span>
      </div>

      <div className="flex flex-wrap gap-3">
        {product.colors?.map((color) => (
          <div
            key={color.color}
            className={`group relative flex items-center gap-3 border-2 rounded-xl p-3 transition-all duration-300 cursor-pointer hover:scale-105 ${
              color.color === colorProduct.color
                ? "border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg ring-4 ring-blue-200"
                : "border-gray-200 hover:border-gray-400 bg-white hover:shadow-md"
            }`}
            onClick={() => setColorProduct(color)}
          >
            <ImageWithFallback
              src={color.primaryImage?.url}
              alt={color.color}
              className="w-12 h-12 rounded-lg object-cover shadow-sm"
              fallbackSrc="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iOCIgZmlsbD0iI0Y5RkFGQiIvPgo8cGF0aCBkPSJNMjQgMzJDMjggMzIgMzEuNSAyOC41IDMxLjUgMjRDMzEuNSAxOS41IDI4IDE2IDI0IDE2QzIwIDE2IDE2LjUgMTkuNSAxNi41IDI0QzE2LjUgMjguNSAyMCAzMiAyNCAzMloiIGZpbGw9IiNFNUU3RUIiLz4KPHBhdGggZD0iTTI0IDI4QzI2LjIwOTEgMjggMjggMjYuMjA5MSAyOCAyNEMyOCAyMS43OTA5IDI2LjIwOTEgMjAgMjQgMjBDMjEuNzkwOSAyMCAyMCAyMS43OTA5IDIwIDI0QzIwIDI2LjIwOTEgMjEuNzkwOSAyOCAyNCAyOFoiIGZpbGw9IiNEMUQ1REIiLz4KPC9zdmc+"
            />
            <span className="font-semibold text-gray-700 group-hover:text-gray-900">
              {color.color}
            </span>
            {color.color === colorProduct.color && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ColorSelector;
