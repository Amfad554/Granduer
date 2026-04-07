import React, { useContext, useEffect, useState } from "react";
import { ProductContext } from "../Context/ProductContext";
import Layout from "../Shared/Layout/Layout";
import { RiDeleteBin3Fill, RiEditCircleFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { ImCancelCircle } from "react-icons/im";
import Edit from "../Context/Edit";
import { baseUrl } from "../App";
import { toast } from "react-toastify";

const Cart = () => {
  // ✅ FIX: cartCout (capital C) matches what ProductContext exports
  const { cartItems, cartCout, HandleDeleteCart, token, User } =
    useContext(ProductContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prod, setProd] = useState(null);
  const [selectedSize, setSetectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log("prod:", prod);
  }, [prod]);

  useEffect(() => {
    if (selectedSize) {
      setProd((prv) => ({ ...prv, size: selectedSize }));
    }
    if (selectedColor) {
      setProd((prv) => ({ ...prv, color: selectedColor }));
    }
    if (quantity) {
      setProd((prv) => ({ ...prv, quantity: quantity }));
    }
  }, [selectedColor, selectedSize, quantity]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  const HandleInitializePayment = async (e) => {
    e.preventDefault();

    // Check if User exists before even trying to fetch
    if (!User?.email) {
      toast.error("Please login to proceed with payment");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${baseUrl}initializePayment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
        body: JSON.stringify({ email: User.email }),
      });

      // Check if the response content-type is actually JSON
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned a non-JSON response. Check your backend routes.");
      }

      const data = await res.json();

      if (res.ok) {
        setIsLoading(false);
        // If payment provider gives a link, redirect
        if (data?.link) {
          window.location.href = data.link;
        } else {
          toast.success(data.message || "Payment initialized");
        }
      } else {
        setIsLoading(false);
        toast.error(data.message || "Failed to initialize payment");
      }
    } catch (error) {
      console.error("Payment Error:", error);
      setIsLoading(false);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 md:px-10 relative">
        {isLoading && (
          <div className="fixed inset-0 z-50 flex justify-center items-center bg-white bg-opacity-75">
            <div className="flex flex-col items-center">
              <p className="text-black mt-2 font-semibold">Processing...</p>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Your Cart
          </h1>
          <p className="text-center text-gray-600 mb-8 text-sm">
            {/* ✅ FIX: cartCout (capital C) */}
            {cartCout} {cartCout === 1 ? "item" : "items"} in your shopping cart
          </p>

          {/* Improved Mobile-Responsive Modal */}
          <div
            className={`${isModalOpen ? "" : "hidden"
              } fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300`}
            onClick={() => setIsModalOpen(false)}
          >
            <div
              className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button - Sticky on mobile */}
              <div className="sticky top-0 right-0 z-10 flex justify-end p-3 bg-white/95 backdrop-blur-sm border-b border-gray-100">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-full bg-gray-100 text-gray-800 hover:bg-gray-200 hover:scale-110 transition-all duration-200"
                >
                  <ImCancelCircle className="h-6 w-6" />
                </button>
              </div>

              {/* Modal Content with proper padding */}
              <div className="p-4 sm:p-6">
                <Edit
                  prod={prod}
                  setSetectedSize={setSetectedSize}
                  setSelectedColor={setSelectedColor}
                  setQuantity={setQuantity}
                  quantity={quantity}
                />
              </div>
            </div>
          </div>

          {cartItems && cartItems.length > 0 ? (
            <div className="space-y-8">
              {/* Desktop Table */}
              <div className="hidden md:block bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                <table className="min-w-full">
                  <thead className="bg-gradient-to-r from-gray-100 to-gray-50 border-b-2 border-gray-200">
                    <tr className="text-left text-gray-700">
                      <th className="py-4 px-5 font-semibold text-xs uppercase tracking-wider">
                        Product
                      </th>
                      <th className="py-4 px-5 font-semibold text-xs uppercase tracking-wider">
                        Price
                      </th>
                      <th className="py-4 px-5 font-semibold text-xs uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="py-4 px-5 font-semibold text-xs uppercase tracking-wider">
                        Total
                      </th>
                      <th className="py-4 px-5 font-semibold text-xs uppercase tracking-wider text-center">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {cartItems.map((item, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 transition-all duration-200 group"
                      >
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden shadow-md group-hover:shadow-lg transition-shadow duration-200 flex-shrink-0">
                              <img
                                src={item?.image || item?.product?.image}
                                alt={item?.name || item?.product?.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                            <span className="font-semibold text-gray-800 text-sm">
                              {item?.name || item?.product?.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-5 text-gray-700 font-medium">
                          ${item?.price || item?.product?.price}
                        </td>
                        <td className="py-4 px-5">
                          <span className="inline-flex items-center justify-center bg-gray-100 text-gray-800 font-semibold px-3 py-1.5 rounded-lg min-w-[50px] text-sm">
                            {item?.quantity}
                          </span>
                        </td>
                        <td className="py-4 px-5 font-bold text-gray-900">
                          $
                          {(
                            (item?.price || item?.product?.price) *
                            item?.quantity
                          ).toFixed(2)}
                        </td>
                        <td className="py-4 px-5">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => {
                                console.log("item:", item);
                                setIsModalOpen(true);
                                setProd(item);
                              }}
                              title="Edit"
                              className="p-2 bg-black text-white rounded-lg hover:bg-gray-800 hover:shadow-lg hover:scale-110 transition-all duration-200 cursor-pointer"
                            >
                              <RiEditCircleFill className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                HandleDeleteCart(item?.id || item?.productid);
                              }}
                              title="Delete"
                              className="p-2 bg-black text-white rounded-lg hover:bg-gray-800 hover:shadow-lg hover:scale-110 transition-all duration-200 cursor-pointer"
                            >
                              <RiDeleteBin3Fill className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="space-y-4 md:hidden">
                {cartItems.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="relative w-24 h-24 rounded-xl overflow-hidden shadow-md flex-shrink-0">
                        <img
                          src={item.image || item?.product?.image}
                          alt={item.name || item?.product?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900 mb-1">
                          {item.name || item?.product?.name}
                        </h3>
                        <p className="text-gray-600 font-semibold text-lg">
                          ${item.price || item?.product?.price}
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 font-medium">
                          Quantity:
                        </span>
                        <span className="bg-white px-4 py-1.5 rounded-lg font-semibold text-gray-800 border border-gray-200">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                        <span className="text-gray-700 font-semibold">
                          Total:
                        </span>
                        <span className="font-bold text-xl text-gray-900">
                          $
                          {(
                            (item?.price || item?.product?.price) *
                            item?.quantity
                          ).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          console.log("item:", item);
                          setIsModalOpen(true);
                          setProd(item);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
                      >
                        <RiEditCircleFill className="w-5 h-5" />
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          HandleDeleteCart(item?.id || item?.productid);
                          console.log("item:", item);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-200"
                      >
                        <RiDeleteBin3Fill className="w-5 h-5" />
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Summary */}
              <div className="flex justify-end">
                <div className="bg-white p-8 rounded-2xl w-full sm:w-2/3 md:w-1/2 lg:w-1/3 shadow-xl border border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-gray-200">
                    Order Summary
                  </h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center text-gray-700">
                      <span className="font-medium">Items in Cart:</span>
                      <span className="bg-gray-100 px-4 py-1.5 rounded-lg font-semibold">
                        {/* ✅ FIX: cartCout (capital C) */}
                        {cartCout}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-gray-700">
                      <span className="font-medium">Subtotal:</span>
                      <span className="font-semibold text-lg">
                        $
                        {cartItems
                          .reduce(
                            (sum, item) =>
                              sum +
                              (item.price || item?.product?.price) *
                              item.quantity,
                            0
                          )
                          .toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t-2 border-gray-200 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-900">
                        Total:
                      </span>
                      <span className="text-2xl font-bold text-gray-900">
                        $
                        {cartItems
                          .reduce(
                            (sum, item) =>
                              sum +
                              (item.price || item?.product?.price) *
                              item.quantity,
                            0
                          )
                          .toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      HandleInitializePayment(e);
                    }}
                    className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center mt-20 bg-white rounded-2xl shadow-xl p-12 max-w-md mx-auto border border-gray-200">
              <div className="text-6xl mb-6">🛒</div>
              <p className="text-2xl font-semibold text-gray-800 mb-2">
                Your cart is empty
              </p>
              <p className="text-gray-600 mb-8 text-center">
                Looks like you haven't added any items yet
              </p>
              <a
                href="/"
                className="bg-black text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Continue Shopping
              </a>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Cart;