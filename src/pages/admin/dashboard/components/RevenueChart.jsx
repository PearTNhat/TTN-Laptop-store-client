import React, { useCallback, useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  FaChartArea,
  FaChartBar,
  FaCalendarAlt,
  FaInfoCircle,
  FaSearchPlus,
  FaSearchMinus,
  FaExpand,
  FaCompress,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { apiRevenue } from "~/apis/dashboardApi";
import { showToastError } from "~/utils/alert";

const RevenueChart = () => {
  const { accessToken } = useSelector((state) => state.user);
  const [revenueData, setRevenueData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // States cho zoom và scale
  const [scaleType, setScaleType] = useState("auto"); // 'auto', 'linear', 'log'
  const [yAxisDomain, setYAxisDomain] = useState(["auto", "auto"]);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [chartHeight, setChartHeight] = useState(400); // Chiều cao biểu đồ
  const fetchRevenueByYear = useCallback(
    async (year) => {
      try {
        const response = await apiRevenue({ accessToken, year });
        if (response.code === 200) {
          setRevenueData(formatRevenueDataForChart(response.data));
        } else {
          throw new Error(response.message || "Failed to fetch data");
        }
      } catch (error) {
        showToastError(error.message);
      }
    },
    [accessToken] // Không cần formatRevenueDataForChart ở đây vì nó là hàm thuần túy
  );
  console.log("first", revenueData);
  const formatRevenueDataForChart = (data) => {
    return data.map((item) => {
      const month = item.yearMonth.split("-")[1];
      // Chia các giá trị cho 1000 để ra số liệu thực
      return {
        month: `T${parseInt(month)}`,
        buy: item.monthlyTotalCost,
        sell: item.monthlyRevenue,
        profit: item.monthlyGrossProfit,
      };
    });
  };
  useEffect(() => {
    fetchRevenueByYear(selectedYear);
  }, [fetchRevenueByYear, selectedYear]);

  const formatCurrency = (value) => {
    if (!value || value === 0) return "0 VNĐ";

    // Format số theo tiêu chuẩn Việt Nam
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Format compact cho trục Y của biểu đồ
  const formatCurrencyCompact = (value) => {
    if (!value || value === 0) return "0";

    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  };

  // Tính toán domain cho Y axis dựa trên scale type
  const calculateYAxisDomain = useCallback(
    (data) => {
      if (!data || data.length === 0) return ["auto", "auto"];

      const allValues = data
        .flatMap((item) => [item.buy || 0, item.sell || 0, item.profit || 0])
        .filter((val) => val > 0);

      if (allValues.length === 0) return ["auto", "auto"];

      const maxValue = Math.max(...allValues);
      const minValue = Math.min(...allValues);

      if (scaleType === "linear") {
        const zoomFactor = zoomLevel / 100;

        if (zoomLevel > 150) {
          // Khi zoom mạnh, focus vào range nhỏ hơn để hiển thị rõ giá trị nhỏ
          const sortedValues = [...allValues].sort((a, b) => a - b);
          const percentile25 =
            sortedValues[Math.floor(sortedValues.length * 0.25)];
          const percentile75 =
            sortedValues[Math.floor(sortedValues.length * 0.75)];

          // Tạo range dựa trên zoom level
          const baseRange = percentile75 - percentile25;
          const zoomRange = baseRange * (200 / zoomLevel); // Càng zoom mạnh, range càng nhỏ

          const midPoint = (percentile25 + percentile75) / 2;
          const adjustedMin = Math.max(0, midPoint - zoomRange);
          const adjustedMax = midPoint + zoomRange;

          return [adjustedMin, adjustedMax];
        } else {
          // Zoom nhẹ hoặc bình thường - giữ toàn bộ range nhưng có padding
          const range = maxValue - minValue;
          const padding = range * 0.1;
          const adjustedMax = (maxValue + padding) / zoomFactor;
          const adjustedMin = Math.max(0, (minValue - padding) / zoomFactor);

          return [adjustedMin, adjustedMax];
        }
      }

      return ["auto", "auto"];
    },
    [scaleType, zoomLevel]
  );

  // Hàm xử lý zoom
  const handleZoomIn = () => {
    const newZoomLevel = Math.min(zoomLevel * 1.2, 500);
    setZoomLevel(newZoomLevel);

    // Tự động tăng chiều cao khi zoom mạnh
    if (newZoomLevel > 200) {
      const heightMultiplier = Math.min(2, newZoomLevel / 200);
      setChartHeight(400 * heightMultiplier);
    }

    if (scaleType === "auto") setScaleType("linear");
    updateYAxisDomain();
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev / 1.2, 20));
    updateYAxisDomain();
  };

  const resetZoom = () => {
    setZoomLevel(100);
    setYAxisDomain(["auto", "auto"]);
    setScaleType("auto");
    setChartHeight(400); // Reset về chiều cao mặc định
  };

  // Focus vào giá trị nhỏ
  const focusOnSmallValues = () => {
    if (!revenueData || revenueData.length === 0) return;

    const allValues = revenueData
      .flatMap((item) => [item.buy || 0, item.sell || 0, item.profit || 0])
      .filter((val) => val > 0);

    if (allValues.length === 0) return;

    const sortedValues = [...allValues].sort((a, b) => a - b);
    const maxValue = sortedValues[sortedValues.length - 1];

    // Lấy 60% giá trị nhỏ nhất để focus
    const focusThreshold = sortedValues[Math.floor(sortedValues.length * 0.6)];

    // Tính zoom level sao cho vùng giá trị nhỏ chiếm phần lớn biểu đồ
    const ratio = maxValue / focusThreshold;
    const targetZoom = Math.min(400, Math.max(200, ratio * 0.8));

    setScaleType("linear");
    setZoomLevel(targetZoom);
    setChartHeight(600); // Tăng chiều cao khi focus vào giá trị nhỏ
    updateYAxisDomain();
  };

  const updateYAxisDomain = useCallback(() => {
    const domain = calculateYAxisDomain(revenueData);
    setYAxisDomain(domain);
  }, [revenueData, calculateYAxisDomain]);

  // Update domain khi data hoặc zoom thay đổi
  useEffect(() => {
    updateYAxisDomain();
  }, [revenueData, zoomLevel, scaleType, updateYAxisDomain]);

  return (
    <div className=" mb-8">
      {/* Biểu đồ so sánh tiền mua và tiền bán */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <FaChartBar className="mr-3 text-green-600" />
              So sánh tiền mua vs tiền bán
            </h3>

            {/* Year Selector */}
            <div className="flex items-center space-x-2">
              <FaCalendarAlt className="text-gray-500" />
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                {Array.from({ length: 10 }, (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return (
                    <option key={year} value={year}>
                      Năm {year}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {/* Scale Type Selector */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-600">Tỷ lệ:</span>
              <select
                value={scaleType}
                onChange={(e) => setScaleType(e.target.value)}
                className="px-2 py-1 text-xs border rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="auto">Tự động</option>
                <option value="linear">Tuyến tính</option>
              </select>
            </div>

            {/* Zoom Level Display */}
            <div className="flex flex-col items-center">
              <span className="text-xs text-gray-600">
                {Math.round(zoomLevel)}%
              </span>
              {scaleType === "linear" && yAxisDomain[0] !== "auto" && (
                <span className="text-xs text-blue-600">
                  {formatCurrencyCompact(yAxisDomain[0])} -{" "}
                  {formatCurrencyCompact(yAxisDomain[1])}
                </span>
              )}
            </div>

            {/* Zoom Buttons */}
            <div className="flex items-center space-x-1 bg-gray-50 rounded-md p-1">
              <button
                onClick={handleZoomIn}
                className="p-1 hover:bg-white rounded transition-colors"
                title="Phóng to (auto tăng chiều cao)"
              >
                <FaSearchPlus className="w-3 h-3 text-gray-600" />
              </button>

              <button
                onClick={handleZoomOut}
                className="p-1 hover:bg-white rounded transition-colors"
                title="Thu nhỏ"
              >
                <FaSearchMinus className="w-3 h-3 text-gray-600" />
              </button>

              <button
                onClick={focusOnSmallValues}
                className="p-1 hover:bg-white rounded transition-colors"
                title="Focus vào giá trị nhỏ (60% thấp nhất)"
              >
                <FaInfoCircle className="w-3 h-3 text-blue-600" />
              </button>

              <button
                onClick={resetZoom}
                className="p-1 hover:bg-white rounded transition-colors"
                title="Reset zoom"
              >
                <FaExpand className="w-3 h-3 text-gray-600" />
              </button>
            </div>

            {/* Legend */}
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span className="text-gray-600">Tiền mua</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-gray-600">Tiền bán</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-gray-600">Lợi nhuận</span>
              </div>
            </div>
          </div>
        </div>
        <div style={{ height: chartHeight }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData}>
              <defs>
                <linearGradient id="colorBuy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0.6} />
                </linearGradient>
                <linearGradient id="colorSell" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.6} />
                </linearGradient>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
              <YAxis
                stroke="#6B7280"
                fontSize={12}
                tickFormatter={formatCurrencyCompact}
                domain={yAxisDomain}
                width={80}
                tickCount={Math.floor(chartHeight / 40)}
                interval={0}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "none",
                  borderRadius: "12px",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                }}
                formatter={(value, name) => {
                  let label = "";
                  switch (name) {
                    case "buy":
                      label = "Tiền mua";
                      break;
                    case "sell":
                      label = "Tiền bán";
                      break;
                    case "profit":
                      label = "Lợi nhuận";
                      break;
                    default:
                      label = name;
                  }
                  return [formatCurrency(value), label];
                }}
              />
              <Bar
                dataKey="buy"
                fill="url(#colorBuy)"
                radius={[4, 4, 0, 0]}
                name="buy"
              />
              <Bar
                dataKey="sell"
                fill="url(#colorSell)"
                radius={[4, 4, 0, 0]}
                name="sell"
              />
              <Bar
                dataKey="profit"
                fill="url(#colorProfit)"
                radius={[4, 4, 0, 0]}
                name="profit"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Thống kê tổng quan */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">
              {formatCurrency(
                revenueData.reduce((sum, item) => sum + item.buy, 0)
              )}
            </p>
            <p className="text-sm text-gray-600 mt-1">Tổng tiền mua</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(
                revenueData.reduce((sum, item) => sum + item.sell, 0)
              )}
            </p>
            <p className="text-sm text-gray-600 mt-1">Tổng tiền bán</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {formatCurrency(
                revenueData.reduce((sum, item) => sum + item.profit, 0)
              )}
            </p>
            <p className="text-sm text-gray-600 mt-1">Tổng lợi nhuận</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;
