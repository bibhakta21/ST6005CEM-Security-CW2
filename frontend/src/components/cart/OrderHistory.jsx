import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const backendURL = "https://localhost:3000";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${backendURL}/api/bookings/my-bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (error) {
      console.error("Error fetching bookings", error);
      toast.error("Failed to load orders");
    }
  };

  const handleCancel = async (id) => {
    try {
      await axios.put(
        `${backendURL}/api/bookings/${id}/cancel`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Order cancelled");
      fetchOrders();
    } catch (error) {
      console.error("Failed to cancel order", error);
      toast.error("Unable to cancel order");
    }
  };

  const canCancel = (createdAt) => {
    const hoursSince = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
    return hoursSince <= 24;
  };

  const handleViewProduct = async (shortName) => {
    try {
      const res = await axios.get(`${backendURL}/api/products`);
      const product = res.data.find((p) => p.shortName === shortName);
      if (product) {
        navigate(`/product/${product._id}`);
      } else {
        toast.error("Product not found");
      }
    } catch (err) {
      toast.error("Error loading product");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-white px-4 md:px-10 py-16 font-[Poppins]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-semibold text-gray-800 mb-2">My Orders</h2>
        <p className="text-sm text-gray-500 mb-6">Manage your clothing orders placed on NepalWears.</p>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md mb-6">
          <p className="text-yellow-800 font-medium">
            Note: Orders can only be cancelled within 24 hours of placement.
          </p>
        </div>

        {orders.length > 0 ? (
          <div className="overflow-x-auto bg-white rounded-xl shadow border">
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="px-4 py-3">Image</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Qty</th>
                  <th className="px-4 py-3">Address</th>
                    <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders
                  .filter(order => order.addressOne && order.addressOne.trim() !== "")
                  .map(order => (
                    <tr key={order._id} className="border-b hover:bg-gray-50 transition-all">
                      <td className="px-4 py-3">
                        <img
                          src={order.productImage.startsWith("/") ? `${backendURL}${order.productImage}` : order.productImage}
                          alt={order.productShortName}
                          className="w-12 h-12 object-contain rounded"
                        />
                      </td>
                      <td
                        onClick={() => handleViewProduct(order.productShortName)}
                        className="px-4 py-3 font-medium text-blue-600 hover:underline cursor-pointer"
                      >
                        {order.productShortName}
                      </td>
                      <td className="px-4 py-3">Rs {order.price}</td>
                      <td className="px-4 py-3">{order.quantity}</td>
                      <td className="px-4 py-3 text-sm">{order.addressOne}</td>
                       <td className="px-4 py-3 text-sm">{order.paymentType}</td>
                      <td className="px-4 py-3 capitalize">{order.status}</td>
                      <td className="px-4 py-3">
                        {order.status === "pending" && canCancel(order.createdAt) ? (
                          <button
                            onClick={() => handleCancel(order._id)}
                            className="px-3 py-1 border border-red-500 text-red-500 rounded-full hover:bg-red-100 transition"
                          >
                            Cancel
                          </button>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-12 text-center text-gray-500 text-sm">No orders found.</div>
        )}
      </div>
    </div>
  );
}
