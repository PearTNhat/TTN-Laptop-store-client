import { NavLink, useLocation } from "react-router-dom";
import { MdOutlineChevronRight, MdHome } from "react-icons/md";
import { memo, Fragment } from "react";

function Breadcrumbs({ title }) {
  const location = useLocation();

  // Custom breadcrumb logic for product detail pages
  const isProductDetail =
    location.pathname.includes("/products/") &&
    location.pathname !== "/products";

  // Create custom breadcrumbs array
  const breadcrumbs = [];

  // Always add home
  breadcrumbs.push({
    path: "/",
    name: "Trang chủ",
    isActive: false,
  });

  if (isProductDetail) {
    // Add products page
    breadcrumbs.push({
      path: "/products",
      name: "Sản phẩm",
      isActive: false,
    });

    // Add current product
    breadcrumbs.push({
      path: location.pathname,
      name: title || "Chi tiết sản phẩm",
      isActive: true,
    });
  } else if (title) {
    // For other pages with title
    breadcrumbs.push({
      path: location.pathname,
      name: title,
      isActive: true,
    });
  }

  return (
    <nav aria-label="Breadcrumb" className="w-full">
      {/* Glass morphism container */}
      <div className="relative bg-white/70 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>

        <div className="relative p-4">
          <ol className="flex items-center space-x-2">
            {breadcrumbs.map((breadcrumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              const isFirst = index === 0;

              return (
                <Fragment key={breadcrumb.path}>
                  <li className="flex items-center">
                    {isLast ? (
                      // Current page - gradient badge
                      <div className="flex items-center bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-4 py-2 rounded-xl shadow-lg">
                        {isFirst && <MdHome className="w-4 h-4 mr-2" />}
                        <span className="font-bold text-sm tracking-wide truncate max-w-[200px]">
                          {breadcrumb.name}
                        </span>
                      </div>
                    ) : (
                      // Links - glass buttons
                      <NavLink
                        to={breadcrumb.path}
                        className="group flex items-center bg-white/50 hover:bg-white/80 backdrop-blur-sm text-gray-700 hover:text-blue-600 px-4 py-2 rounded-xl border border-white/30 hover:border-blue-300/50 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                      >
                        {isFirst && (
                          <MdHome className="w-4 h-4 mr-2 group-hover:text-blue-500 transition-colors" />
                        )}
                        <span className="font-medium text-sm group-hover:font-semibold">
                          {breadcrumb.name}
                        </span>
                      </NavLink>
                    )}
                  </li>

                  {/* Animated separator */}
                  {!isLast && (
                    <li className="flex items-center">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-sm opacity-50"></div>
                        <div className="relative bg-white p-1.5 rounded-full shadow-md">
                          <MdOutlineChevronRight className="w-3 h-3 text-gray-600" />
                        </div>
                      </div>
                    </li>
                  )}
                </Fragment>
              );
            })}
          </ol>
        </div>
      </div>
    </nav>
  );
}

export default memo(Breadcrumbs);
