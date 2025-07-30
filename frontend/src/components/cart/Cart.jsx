import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { FaMinus, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import product1 from "../../assets/product1.png";
import { UserContext } from "../../context/UserContext";
import { generateEsewaSignature } from "../../utils/esewaSignature";

const backendURL = "http://localhost:3000";

const Cart = () => {
  const { user, setCartCount } = useContext(UserContext);
  const token = localStorage.getItem("token");

  const [cartItems, setCartItems] = useState([]);
  const [addressOne, setAddressOne] = useState("");
  const [number, setnumber] = useState("");
  const [paymentType, setPaymentType] = useState("Cash on Delivery");
  const esewaFormRef = useRef(null);

  useEffect(() => {
    const fetchCart = async () => {
      if (!user) return setCartItems([]);

      try {
        const res = await axios.get(`${backendURL}/api/bookings/my-bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const pendingCart = res.data.filter(
          (b) => b.status === "pending" && (!b.addressOne || b.addressOne.trim() === "")
        );

        const mapped = pendingCart.map((b) => ({
          id: b._id,
          name: b.productShortName,
          price: b.price,
          img: b.productImage
            ? b.productImage.startsWith("/")
              ? `${backendURL}${b.productImage}`
              : b.productImage
            : product1,
          quantity: b.quantity,
        }));

        setCartItems(mapped);
        const totalQuantity = mapped.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(totalQuantity);
      } catch (err) {
        console.error("Failed to fetch cart", err);
        toast.error("Failed to load cart");
      }
    };

    fetchCart();
  }, [user, token, setCartCount]);

  const handleQuantityChange = (id, delta) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.min(5, Math.max(1, item.quantity + delta)),
            }
          : item
      )
    );
  };

  const handleCancelOrder = async (id) => {
    try {
      await axios.put(`${backendURL}/api/bookings/${id}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Order cancelled");

      setCartItems((prev) => {
        const updated = prev.filter((item) => item.id !== id);
        const newTotal = updated.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(newTotal);
        return updated;
      });
    } catch (err) {
      console.error("Cancel failed", err);
      toast.error("Failed to cancel order");
    }
  };

  const validateFields = () => {
    if (!addressOne.trim() || !number.trim()) {
      toast.error("Please fill in all required fields");
      return false;
    }

    if (!/^\d{7,15}$/.test(number)) {
      toast.error("Enter a valid phone number");
      return false;
    }

    return true;
  };

  const handleCheckout = async () => {
    if (!validateFields()) return;
    if (cartItems.length === 0) {
      toast.error("No items in cart");
      return;
    }

    try {
      await Promise.all(
        cartItems.map((item) =>
          axios.put(
            `${backendURL}/api/bookings/${item.id}`,
            {
              addressOne,
              number,
              paymentType,
              quantity: item.quantity,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          )
        )
      );

      toast.success("Your order has been booked");
      setCartItems([]);
      setCartCount(0);
      setAddressOne("");
      setnumber("");
      setPaymentType("Cash on Delivery");
    } catch (err) {
      console.error("Checkout error", err);
      toast.error("Checkout failed");
    }
  };

  const handleEsewaPayment = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    try {
      await Promise.all(
        cartItems.map((item) =>
          axios.put(
            `${backendURL}/api/bookings/${item.id}`,
            {
              addressOne,
              number,
              paymentType: "eSewa",
              quantity: item.quantity,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
        )
      );

      esewaFormRef.current?.submit();
    } catch (err) {
      console.error("Failed to update bookings before eSewa payment", err);
      toast.error("Failed to prepare for eSewa payment");
    }
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const deliveryCharge = 200;
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + deliveryCharge;

  return (
    <div className="min-h-screen bg-white px-6 py-12 md:px-16 lg:px-24">
      <h2 className="text-3xl font-bold mb-10 text-gray-800">
        Checkout Your Order
      </h2>
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-3">Shopping Cart</h3>
          {cartItems.length === 0 ? (
            <p className="text-gray-500 mb-6">No items in cart.</p>
          ) : (
            <>
              <p className="text-gray-500 mb-6">
                You have {totalItems} items in your cart
              </p>
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.img}
                        alt={item.name}
                        className="w-14 h-14 object-contain"
                      />
                      <p className="text-base font-medium text-gray-700">
                        {item.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleQuantityChange(item.id, -1)}
                          className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-200"
                        >
                          <FaMinus size={12} />
                        </button>
                        <span className="font-semibold text-gray-800 w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.id, 1)}
                          className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-200"
                        >
                          <FaPlus size={12} />
                        </button>
                      </div>
                      <span className="text-sm font-semibold text-gray-800">
                        Rs {item.price * item.quantity}
                      </span>
                      <button
                        onClick={() => handleCancelOrder(item.id)}
                        className="text-red-500 text-xs underline hover:text-red-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          <Link to="/orderhistory">
            <button className="mt-8 px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition">
              Order History
            </button>
          </Link>
        </div>

        <div className="w-full lg:w-[400px] bg-gray-100 p-8 rounded-2xl shadow-md">
          <h3 className="text-lg font-semibold mb-6">Shipping Details</h3>
          <div className="mb-5 space-y-4">
            <input
              type="text"
              placeholder="Address"
              className="w-full px-4 py-3 rounded-md border border-gray-300"
              value={addressOne}
              onChange={(e) => setAddressOne(e.target.value)}
            />
            <input
              type="text"
              placeholder="Phone Number"
              className="w-full px-4 py-3 rounded-md border border-gray-300"
              value={number}
              onChange={(e) => setnumber(e.target.value)}
            />
          </div>

          <h4 className="text-md font-semibold mb-3">Select Payment Method</h4>
          <div className="flex flex-col gap-3 mb-6">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="paymentType"
                checked={paymentType === "Cash on Delivery"}
                onChange={() => setPaymentType("Cash on Delivery")}
              />
              Cash on Delivery
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="paymentType"
                checked={paymentType === "eSewa"}
                onChange={() => setPaymentType("eSewa")}
              />
              eSewa
            </label>
          </div>

          <div className="text-sm space-y-4 mb-6 text-gray-700">
            <div className="flex justify-between">
              <span className="font-medium">Total Items:</span>
              <span>{totalItems}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Delivery Charge:</span>
              <span>Rs {deliveryCharge}</span>
            </div>
            <div className="flex justify-between pt-4 border-t border-gray-300 text-base font-semibold text-black">
              <span>Total:</span>
              <span>Rs {total}</span>
            </div>
          </div>

          {paymentType === "Cash on Delivery" && (
            <button
              onClick={handleCheckout}
              className="w-full py-3 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition"
            >
              Check Out
            </button>
          )}

          {paymentType === "eSewa" && cartItems.length > 0 && (() => {
            const transaction_uuid = uuidv4();
            const total_amount = subtotal + deliveryCharge;
            const { signedFieldNames, signature } = generateEsewaSignature({
              total_amount,
              transaction_uuid,
              product_code: "EPAYTEST",
            });

            return (
              <form
                ref={esewaFormRef}
                onSubmit={handleEsewaPayment}
                action="https://rc-epay.esewa.com.np/api/epay/main/v2/form"
                method="POST"
                className="mt-4 space-y-2"
              >
                <input type="hidden" name="amount" value={subtotal} />
                <input type="hidden" name="tax_amount" value="0" />
                <input type="hidden" name="total_amount" value={total_amount} />
                <input type="hidden" name="transaction_uuid" value={transaction_uuid} />
                <input type="hidden" name="product_code" value="EPAYTEST" />
                <input type="hidden" name="product_service_charge" value="0" />
                <input type="hidden" name="product_delivery_charge" value={deliveryCharge} />
                <input type="hidden" name="success_url" value="http://localhost:5173/paymentsuccess" />
                <input type="hidden" name="failure_url" value="http://localhost:5173/paymentfailure" />
                <input type="hidden" name="signed_field_names" value={signedFieldNames} />
                <input type="hidden" name="signature" value={signature} />

                <button
                  type="submit"
                  className="w-full py-3 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition"
                >
                  Pay with eSewa
                </button>
              </form>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default Cart;
