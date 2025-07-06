import { memo } from "react";
import clsx from "clsx"; // Thư viện tiện ích để nối các class name có điều kiện
import { DOTS, usePagination } from "~/hooks/usePagination";

function Pagination({
  siblingCount,
  currentPage,
  totalPageCount,
  onPageChange,
}) {
  const paginationRange = usePagination({
    siblingCount,
    currentPage,
    totalPageCount,
  });

  // Nếu chỉ có 1 trang hoặc không có item nào, không hiển thị pagination
  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const lastPage = paginationRange[paginationRange.length - 1];

  return (
    <nav aria-label="Page navigation">
      <ul className="flex items-center justify-center -space-x-px">
        {/* Nút Previous */}
        <li>
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={onPrevious}
            className={clsx(
              "w-10 h-10 flex justify-center items-center text-gray-500 bg-white border border-gray-300 rounded-l-lg transition-colors",
              "hover:bg-blue-50 hover:text-blue-600",
              // "focus:outline-none focus:ring-2 focus:ring-blue-300",
              {
                "cursor-not-allowed text-gray-400 bg-gray-50":
                  currentPage === 1,
              }
            )}
          >
            <span className="sr-only">Previous</span>
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </li>

        {/* Các nút số trang */}
        {paginationRange.map((pageNumber, index) => {
          // Hiển thị dấu chấm '...'
          if (pageNumber === DOTS) {
            return (
              <li key={`dots-${index}`}>
                <span className="w-10 h-10 flex justify-center items-center text-gray-500 bg-white border border-gray-300">
                  {DOTS}
                </span>
              </li>
            );
          }

          // Hiển thị nút số trang
          return (
            <li key={pageNumber}>
              <button
                type="button"
                onClick={() => onPageChange(pageNumber)}
                className={clsx(
                  "w-10 h-10 flex justify-center items-center font-medium border border-gray-300 transition-colors",
                  // "focus:outline-none focus:ring-2 focus:ring-blue-300",
                  {
                    "bg-blue-500 text-white border-blue-500 z-10":
                      currentPage === pageNumber,
                    "bg-white text-gray-500 hover:bg-blue-50 hover:text-blue-600":
                      currentPage !== pageNumber,
                  }
                )}
              >
                {pageNumber}
              </button>
            </li>
          );
        })}

        {/* Nút Next */}
        <li>
          <button
            type="button"
            disabled={currentPage === lastPage}
            onClick={onNext}
            className={clsx(
              "w-10 h-10 flex justify-center items-center text-gray-500 bg-white border border-gray-300 rounded-r-lg transition-colors",
              "hover:bg-blue-50 hover:text-blue-600",
              // "focus:outline-none focus:ring-2 focus:ring-blue-300",
              {
                "cursor-not-allowed text-gray-400 bg-gray-50":
                  currentPage === lastPage,
              }
            )}
          >
            <span className="sr-only">Next</span>
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default memo(Pagination);
