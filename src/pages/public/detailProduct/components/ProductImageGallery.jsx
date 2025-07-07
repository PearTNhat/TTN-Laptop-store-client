import { useMemo } from "react";
import ImageGallery from "react-image-gallery";

// Import file CSS của thư viện. Bước này RẤT QUAN TRỌNG.
// Bạn có thể import ở đây hoặc trong file App.jsx/main.jsx chính của dự án.
import "react-image-gallery/styles/css/image-gallery.css";

/**
 * Component hiển thị gallery ảnh sản phẩm với ảnh chính và thumbnails.
 * @param {object} props
 * @param {Array<{url: string}>} props.images - Mảng các đối tượng ảnh.
 */
function ProductImageGallery({ images = [] }) {
  // Thư viện yêu cầu một định dạng cụ thể { original: string, thumbnail: string }
  // Chúng ta sẽ chuyển đổi dữ liệu từ props cho phù hợp
  const galleryItems = useMemo(() => {
    if (!images || images.length === 0) return [];

    return images.map((image, index) => ({
      original: image?.url || image || "/placeholder-image.jpg",
      thumbnail: image?.url || image || "/placeholder-image.jpg",
      originalAlt: `Product image ${index + 1}`,
      thumbnailAlt: `Product thumbnail ${index + 1}`,
    }));
  }, [images]);

  if (!images || images.length === 0 || galleryItems.length === 0) {
    // Hiển thị một ảnh placeholder đẹp mắt nếu không có ảnh
    return (
      <div className="relative w-full h-96 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 rounded-2xl border-2 border-gray-300 flex items-center justify-center shadow-lg">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center shadow-md">
            <span className="text-3xl text-gray-600">📷</span>
          </div>
          <p className="text-gray-600 font-medium text-lg">Không có hình ảnh</p>
          <p className="text-gray-500 text-sm mt-1">
            Hình ảnh sản phẩm đang được cập nhật
          </p>
        </div>
        <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold">
          Sắp có ảnh
        </div>
      </div>
    );
  }

  return (
    // Custom lại một chút CSS để phù hợp với giao diện hiện đại
    <div className="product-gallery-container">
      <style>
        {`
          .product-gallery-container .image-gallery {
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          }
          .product-gallery-container .image-gallery-slide .image-gallery-image {
            object-fit: contain;
            max-height: 500px;
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            border-radius: 16px;
            transition: transform 0.3s ease;
            width: 100%;
            height: auto;
          }
          .product-gallery-container .image-gallery-slide .image-gallery-image:hover {
            
          }
          .product-gallery-container .image-gallery-slide img {
            max-width: 100%;
            max-height: 500px;
            object-fit: contain;
            border-radius: 16px;
          }
          .product-gallery-container .image-gallery-thumbnail {
            border: 3px solid transparent;
            border-radius: 12px;
            transition: all 0.3s ease;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }
          .product-gallery-container .image-gallery-thumbnail.active {
            border-color: #3b82f6;
            box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3);
            
          }
          .product-gallery-container .image-gallery-thumbnail:hover {
            border-color: #6366f1;
            box-shadow: 0 8px 15px -3px rgba(0, 0, 0, 0.1);
          }
          .product-gallery-container .image-gallery-thumbnail-image {
            border-radius: 8px;
            transition: all 0.3s ease;
          }

          /* ===== FIX LỖI NÚT ĐIỀU HƯỚNG ===== */
          .product-gallery-container .image-gallery-left-nav,
          .product-gallery-container .image-gallery-right-nav {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
            
            /* Dùng Flexbox để canh giữa icon */
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0; /* Bỏ padding mặc định */
          }
          
          .product-gallery-container .image-gallery-left-nav:hover,
          .product-gallery-container .image-gallery-right-nav:hover {
            background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
          }

          /* Style trực tiếp cho icon SVG bên trong */
          .product-gallery-container .image-gallery-svg {
            height: 24px;
            width: 24px;
            stroke: white;
            stroke-width: 2px; /* Điều chỉnh độ dày của icon */
          }
          /* ==================================== */

          .product-gallery-container .image-gallery-fullscreen-button {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
            border-radius: 12px;
            padding: 8px 12px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
            
             /* Dùng Flexbox để canh giữa icon */
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .product-gallery-container .image-gallery-fullscreen-button:hover {
            background: linear-gradient(135deg, #f5576c 0%, #f093fb 100%);
            
          }
        `}
      </style>
      <ImageGallery
        items={galleryItems}
        showPlayButton={false} // Ẩn nút tự động trình chiếu
        showFullscreenButton={true} // Hiện nút xem toàn màn hình
        thumbnailPosition="bottom" // Hiển thị thumbnails ở dưới
        lazyLoad={true} // Tải lười các ảnh để tối ưu hiệu năng
        showNav={galleryItems.length > 1} // Chỉ hiển thị nút điều hướng khi có nhiều hơn 1 ảnh
        slideDuration={450} // Tốc độ chuyển slide
        slideInterval={2000} // Thời gian giữa các slide
        infinite={galleryItems.length > 1} // Chỉ lặp vô hạn khi có nhiều ảnh
        disableSwipe={galleryItems.length <= 1} // Disable swipe khi chỉ có 1 ảnh
        useBrowserFullscreen={false} // Sử dụng fullscreen của trình duyệt
        showThumbnails={galleryItems.length > 1} // Chỉ hiện thumbnails khi có nhiều ảnh
        onErrorImageURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiByeD0iMTYiIGZpbGw9IiNGOUZBRkIiLz4KPHBhdGggZD0iTTIwMCAyODBDMjMwIDI4MCAyNTUgMjU1IDI1NSAyMjVDMjU1IDE5NSAyMzAgMTcwIDIwMCAxNzBDMTcwIDE3MCAxNDUgMTk1IDE0NSAyMjVDMTQ1IDI1NSAxNzAgMjgwIDIwMCAyODBaIiBmaWxsPSIjRTVFN0VCIi8+CjxwYXRoIGQ9Ik0yMDAgMjQwQzIxNi41NjkgMjQwIDIzMCAyMjYuNTY5IDIzMCAyMTBDMjMwIDE5My40MzEgMjE2LjU2OSAxODAgMjAwIDE4MEMxODMuNDMxIDE4MCAxNzAgMTkzLjQzMSAxNzAgMjEwQzE3MCAyMjYuNTY5IDE4My40MzEgMjQwIDIwMCAyNDBaIiBmaWxsPSIjRDFENURCIi8+CjxwYXRoIGQ9Ik0zMjAgMTAwTDI4MCAxNDBMMjAwIDYwTDEwMCAxNjBMMTUwIDIxMEwzMjAgNDBaIiBmaWxsPSIjQ0NDRkRCIi8+PHRleHQgeD0iMjAwIiB5PSIzNTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5Q0EzQUYiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmb250LXdlaWdodD0iYm9sZCI+SW1hZ2UgTm90IEZvdW5kPC90ZXh0Pgo8L3N2Zz4=" // Ảnh thay thế khi lỗi
      />
    </div>
  );
}

export default ProductImageGallery;
