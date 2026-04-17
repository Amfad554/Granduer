import React, { useContext, useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import Confetti from "react-confetti";
import { toast } from "react-toastify";
import { ProductContext } from "../Context/ProductContext";
import { baseUrl } from "../App";
import { PulseLoader } from "react-spinners";

// ✅ Module-level flag — survives StrictMode double-invoke
let paymentVerified = false;

export default function ThankYouPage() {
  const [params] = useSearchParams();
  const transactionId = params.get("transaction_id");

  const { token, setCartItems } = useContext(ProductContext);

  const [isVerified, setIsVerified] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const verifyPayment = async () => {
      // ✅ Wait for token to be available from localStorage/context
      if (!token) return;

      // ✅ Prevent double-calling (StrictMode + re-renders)
      if (paymentVerified) {
        setIsLoading(false);
        return;
      }

      if (!transactionId) {
        toast.error("No transaction ID found");
        setIsLoading(false);
        return;
      }

      paymentVerified = true;

      const res = await fetch(
        `${baseUrl}verifyPayment?transaction_id=${transactionId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Status:", res.status);
      console.log("Token:", token);
      console.log("Transaction ID:", transactionId);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Server Error:", errorText); // ← what is the actual error?
        throw new Error("Server returned an error.");
      }

      const data = await res.json();
      console.log("Response data:", data); // ← what does server return?                    
      
      if (data.success) {
        setIsVerified(true);
        setReceiptData(data.data);
        toast.success("Payment verified successfully!");
        // ✅ Clear cart after successful payment
        setCartItems([]);
        localStorage.removeItem("cartItems");
        // ✅ Reset cartReadyRef so cart re-fetches next time (optional)
        localStorage.removeItem("cartSynced");
      } else {
        toast.error(data?.message || "Payment verification failed.");
        paymentVerified = false; // ✅ Allow retry if server said false
      }
    } catch (err) {
      console.error("Verification error:", err);
      toast.error("Payment verification failed. Please contact support.");
      paymentVerified = false; // ✅ Allow retry on network error
    } finally {
      setIsLoading(false);
    }
  };

  verifyPayment();
}, [transactionId, token, setCartItems]);
// ✅ token in deps means it retries once token loads from context

// ✅ Reset module flag when component unmounts
useEffect(() => {
  return () => {
    paymentVerified = false;
  };
}, []);

// Window resize handler for Confetti
useEffect(() => {
  const handleResize = () => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  };
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);

if (isLoading) {
  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center z-50 bg-white">
      <PulseLoader size={12} color="#000" />
      <p className="mt-2 font-semibold text-lg text-black">Verifying Payment...</p>
    </div>
  );
}

if (!isVerified) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center px-4">
      <p className="text-xl font-bold mb-4 text-red-600">Payment verification failed.</p>
      <p className="text-gray-600 mb-6">
        If your money was deducted, please contact our support team.
      </p>
      <a
        href="/"
        className="px-6 py-3 rounded-xl bg-black text-white hover:bg-gray-800 transition"
      >
        Go Back Home
      </a>
    </div>
  );
}

return (
  <div className="relative min-h-screen flex items-center justify-center bg-white text-black px-4">
    <Confetti
      width={windowSize.width}
      height={windowSize.height}
      numberOfPieces={80}
      recycle={false}
    />

    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-8 rounded-3xl shadow-xl max-w-lg w-full border border-gray-100 text-center z-10"
    >
      <div className="flex justify-center">
        <div className="text-white w-20 h-20 flex items-center justify-center rounded-full shadow-lg mb-6 bg-green-500">
          <FaCheckCircle className="w-10 h-10" />
        </div>
      </div>

      <h1 className="text-3xl font-extrabold mb-2">Order Confirmed!</h1>
      <p className="text-gray-600 mb-6">
        Thank you for your purchase. Your receipt is ready below.
      </p>

      {receiptData && (
        <div className="bg-gray-50 p-5 rounded-2xl text-left mb-6 border border-gray-100">
          <h3 className="font-bold mb-3 border-b pb-2">Receipt Details</h3>
          <div className="space-y-1 text-sm">
            <p><strong>Order ID:</strong> {receiptData.orderId}</p>
            <p><strong>Transaction ID:</strong> {transactionId}</p>
            <p><strong>Amount Paid:</strong> ₦{receiptData.amount?.toLocaleString()}</p>
            <p><strong>Customer:</strong> {receiptData.name}</p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <motion.a
          href="/"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-3 rounded-xl bg-black text-white font-semibold hover:bg-gray-800 transition"
        >
          Continue Shopping
        </motion.a>
      </div>
    </motion.div>
  </div>
);
}