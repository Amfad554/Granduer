import React, { useContext, useEffect, useState } from "react";
import { ProductContext } from "../Context/ProductContext";

import { RiDeleteBin3Fill, RiEditCircleFill } from "react-icons/ri";
import { ImCancelCircle } from "react-icons/im";
import Edit from "../Component/SingleProductComponent/Edit";
import Layout from "../shared/Layout";

const Cart = () => {
  const { cartItems, cartcout, HandleDeleteCart } = useContext(ProductContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [product, setProd] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Update selected fields dynamically
  useEffect(() => {
    if (selectedSize) setProd((prev) => ({ ...prev, size: selectedSize }));
    if (selectedColor) setProd((prev) => ({ ...prev, color: selectedColor }));
    if (quantity) setProd((prev) => ({ ...prev, quantity }));
  }, [selectedColor, selectedSize, quantity]);

  return (
    <Layout>
      <div className="min-h-screen bg-white py-10 px-4 md:px-10 relative flex flex-col">
        <h1 className="text-4xl font-bold text-center mb-10 tracking-wide">
          Your Cart
        </h1>

        {/* Modal */}
        <div
          className={`fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 transition-all duration-300 ${
            isModalOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          <div className="relative w-[92%] max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[88vh] overflow-y-auto">
            <span
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-primary bg-white rounded-full shadow-md border border-gray-300 hover:bg-black hover:text-white transition p-2 cursor-pointer"
            >
              <ImCancelCircle className="h-5 w-5" />
            </span>
            <Edit
              product={product}
              setSelectedSize={setSelectedSize}
              selectedSize={selectedSize}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              setQuantity={setQuantity}
              quantity={quantity}
              closeModal={() => setIsModalOpen(false)}
            />
          </div>
        </div>

        {cartItems && cartItems.length > 0 ? (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-hidden border border-gray-200 rounded-2xl shadow-md">
              <table className="min-w-full border-collapse">
                <thead className="bg-gray-100">
                  <tr className="text-left text-gray-700">
                    <th className="py-4 px-6 font-semibold">Product</th>
                    <th className="py-4 px-6 font-semibold">Price</th>
                    <th className="py-4 px-6 font-semibold">Quantity</th>
                    <th className="py-4 px-6 font-semibold">Total</th>
                    <th className="py-4 px-6 text-center font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item, index) => (
                    <tr
                      key={index}
                      className="border-t hover:bg-gray-50 transition duration-300"
                    >
                      <td className="py-4 px-6 flex items-center gap-4">
                        <img
                          src={item?.image}
                          alt={item?.name}
                          className="w-14 h-14 object-cover rounded-lg shadow-sm"
                        />
                        <span className="font-medium text-gray-800">
                          {item?.name}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-700">
                        ${item?.price}
                      </td>
                      <td className="py-4 px-6 text-gray-700">
                        {item?.quantity}
                      </td>
                      <td className="py-4 px-6 font-semibold text-gray-800">
                        ${(item?.price * item?.quantity).toFixed(2)}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex justify-center gap-3">
                          {/* Edit Button */}
                          <span
                            onClick={() => {
                              setIsModalOpen(true);
                              setProd(item);
                            }}
                            className="bg-black text-white p-2 rounded-md hover:bg-gray-800 transition"
                            title="Edit"
                          >
                            <RiEditCircleFill />
                          </span>

                          {/* Delete Button */}
                          <span
                            onClick={() => HandleDeleteCart(item.id)}
                            className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition"
                            title="Delete"
                          >
                            <RiDeleteBin3Fill />
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-5">
              {cartItems.map((item, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <p className="text-gray-600">${item.price}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-3 text-sm text-gray-700">
                    <span>Qty: {item.quantity}</span>
                    <span className="font-semibold">
                      Total: ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => {
                        setIsModalOpen(true);
                        setProd(item);
                      }}
                      className="flex-1 bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => HandleDeleteCart(item.id)}
                      className="flex-1 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="flex justify-end mt-10">
              <div className="bg-gray-100 p-6 rounded-2xl shadow-md w-full sm:w-2/3 md:w-1/3">
                <div className="flex justify-between mb-3 text-gray-700">
                  <span>Items in Cart:</span>
                  <span className="font-semibold">{cartcout}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900">
                  <span>Total:</span>
                  <span>
                    $
                    {cartItems
                      .reduce(
                        (sum, item) => sum + item.price * item.quantity,
                        0
                      )
                      .toFixed(2)}
                  </span>
                </div>
                <button className="mt-6 w-full bg-black text-white py-3 rounded-md font-semibold hover:bg-gray-800 transition">
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center mt-20 text-gray-600">
            <p className="text-xl mb-6">Your cart is currently empty 🛒</p>
            <a
              href="/"
              className="bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800 transition"
            >
              Continue Shopping
            </a>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Cart;
