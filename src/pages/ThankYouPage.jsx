import React, { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import Confetti from "react-confetti";

export default function ThankYouPage() {
    const [params] = useSearchParams();
    const status = params.get("status");
    const txRef = params.get("tx_ref");
    const transactionId = params.get("transaction_id");

    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
        });
    }, []);

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-white text-black px-4">

            <Confetti width={windowSize.width} height={windowSize.height} numberOfPieces={150} />

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="bg-white p-8 rounded-3xl shadow-xl max-w-lg w-full border border-gray-200 text-center"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
                    className="flex justify-center"
                >
                    <div className="bg-black text-white w-20 h-20 flex items-center justify-center rounded-full shadow-lg mb-6">
                        <FaCheckCircle className="w-10 h-10" />
                    </div>
                </motion.div>

                <h1 className="text-3xl font-extrabold mb-2 tracking-tight">
                    Payment Successful!
                </h1>

                <p className="text-gray-600 mb-6 text-lg">
                    Your payment has been confirmed. Thank you for shopping with us!
                </p>

                {/* Transaction Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gray-100 p-5 rounded-2xl shadow-inner text-left mb-6"
                >
                    <p className="mb-2"><strong>Status:</strong> {status}</p>
                    <p className="mb-2"><strong>Transaction Ref:</strong> {txRef}</p>
                    <p><strong>Transaction ID:</strong> {transactionId}</p>
                </motion.div>

                {/* Buttons */}
                <div className="flex flex-col gap-3">

                    <motion.a
                        href={`/order/${txRef}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 rounded-xl border border-black hover:bg-black hover:text-white transition-all duration-300 shadow-sm"
                    >
                        View Order
                    </motion.a>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => alert("Receipt Download Coming Soon")}
                        className="px-6 py-3 rounded-xl border border-black hover:bg-black hover:text-white transition-all duration-300 shadow-sm"
                    >
                        Download Receipt
                    </motion.button>

                    <motion.a
                        href="/"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 rounded-xl bg-black text-white hover:bg-white hover:text-black border border-black transition-all duration-300 shadow-sm"
                    >
                        Continue Shopping
                    </motion.a>

                </div>
            </motion.div>
        </div>
    );
}
