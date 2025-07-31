import axios from "axios";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import React, { useEffect, useState } from "react";
import { Bar, Doughnut, Line, Pie } from "react-chartjs-2";
import { FaBox, FaCartShopping, FaSackDollar, FaUser } from "react-icons/fa6";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

const DashboardHome = () => {
  const [dashboardData, setDashboardData] = useState({
    totalSalesRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    productOrders: [],
    weeklyOrders: [],
    orderStatus: [],
    contactRequests: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3000/api/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDashboardData(res.data);
      } catch (error) {
        console.error("❌ Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const summaryCards = [
    {
      id: 1,
      value: `Rs ${dashboardData.totalSalesRevenue.toLocaleString()}`,
      label: "Total Sales",
      bgColor: "bg-gradient-to-br from-red-100 to-red-50",
      icon: <FaSackDollar />,
      iconBgColor: "bg-red-500",
    },
    {
      id: 2,
      value: dashboardData.totalOrders,
      label: "Total Orders",
      bgColor: "bg-gradient-to-br from-yellow-100 to-yellow-50",
      icon: <FaCartShopping />,
      iconBgColor: "bg-yellow-500",
    },
    {
      id: 3,
      value: dashboardData.totalProducts,
      label: "Total Watches",
      bgColor: "bg-gradient-to-br from-green-100 to-green-50",
      icon: <FaBox />,
      iconBgColor: "bg-green-500",
    },
    {
      id: 4,
      value: dashboardData.totalCustomers,
      label: "Total Customers",
      bgColor: "bg-gradient-to-br from-purple-100 to-purple-50",
      icon: <FaUser />,
      iconBgColor: "bg-purple-500",
    },
  ];

  return (
    <div className="p-6">
      {loading ? (
        <p className="text-center text-gray-500 text-lg">Loading dashboard...</p>
      ) : (
        <>
          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {summaryCards.map((card) => (
              <div key={card.id} className={`p-4 rounded-xl shadow-md ${card.bgColor}`}>
                <div className="flex items-center gap-3">
                  <div className={`text-white w-10 h-10 text-lg flex items-center justify-center rounded-full ${card.iconBgColor}`}>
                    {card.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">{card.value}</h3>
                    <p className="text-gray-600 text-sm">{card.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {/* Top Selling Watches - Pie */}
            {dashboardData?.productOrders?.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow flex flex-col items-center h-[370px]">
                <h2 className="text-md font-semibold mb-4">Top Ordered Watches</h2>
                <div className="w-[240px] h-[280px]">
                  <Pie
                    data={{
                      labels: dashboardData.productOrders.map((p) => p.productName),
                      datasets: [
                        {
                          data: dashboardData.productOrders.map((p) => p.count),
                          backgroundColor: ["#6366F1", "#F59E0B", "#10B981", "#EF4444", "#3B82F6"],
                        },
                      ],
                    }}
                    options={{ maintainAspectRatio: false }}
                  />
                </div>
              </div>
            )}

            {/* Weekly Orders - Bar */}
            {dashboardData?.weeklyOrders?.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow flex flex-col items-center h-[370px]">
                <h2 className="text-md font-semibold mb-4">Weekly Orders</h2>
                <Bar
                  data={{
                    labels: dashboardData.weeklyOrders.map((w) => {
                      if (w._id && w._id.week && w._id.year) {
                        return `W${w._id.week} ${w._id.year}`;
                      } else {
                        return "Unknown Week";
                      }
                    }),
                    datasets: [
                      {
                        label: "Orders",
                        data: dashboardData.weeklyOrders.map((w) => w.count || 0),
                        backgroundColor: "#4F46E5",
                      },
                    ],
                  }}
                  options={{
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      x: { grid: { display: false } },
                      y: { ticks: { stepSize: 1 }, beginAtZero: true },
                    },
                  }}
                />
              </div>
            )}

            {/* Order Status - Doughnut */}
            {dashboardData?.orderStatus?.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow flex flex-col items-center h-[370px]">
                <h2 className="text-md font-semibold mb-4">Order Status Overview</h2>
                <div className="w-[240px] h-[280px]">
                  <Doughnut
                    data={{
                      labels: dashboardData.orderStatus.map((s) => s._id),
                      datasets: [
                        {
                          data: dashboardData.orderStatus.map((s) => s.count),
                          backgroundColor: ["#34D399", "#F87171", "#FBBF24", "#60A5FA"],
                        },
                      ],
                    }}
                    options={{ maintainAspectRatio: false }}
                  />
                </div>
              </div>
            )}

            {/* Contact Requests - Line Chart */}
            {dashboardData?.contactRequests?.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow flex flex-col items-center h-[370px]">
                <h2 className="text-md font-semibold mb-4">Monthly Inquiries</h2>
                <Line
                  data={{
                    labels: dashboardData.contactRequests.map((c) => `Month ${c._id}`),
                    datasets: [
                      {
                        label: "Requests",
                        data: dashboardData.contactRequests.map((c) => c.count),
                        borderColor: "#EC4899",
                        backgroundColor: "#F9A8D4",
                        tension: 0.4,
                      },
                    ],
                  }}
                  options={{
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      x: { grid: { display: false } },
                      y: { beginAtZero: true },
                    },
                  }}
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardHome;
