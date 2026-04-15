import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { ProductContext } from "../Context/ProductContext";
import Layout from "../Shared/Layout/Layout";




const Women = () => {
  const { productData, HandleGetProducts, HandleAddTCart } = useContext(ProductContext);
  const [womenProducts, setWomenProducts] = useState([]);

  // ✅ Same pattern as NewArrivals — only fetch if no data
  useEffect(() => {
  if (!productData) return;
  setWomenProducts(productData.filter(p => p.category === "women"));
}, [productData]);
  // ✅ Loading state like NewArrivals
  if (!productData) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-600 text-lg font-medium">Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-10 px-5 md:px-10">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Women's Collection 👗
        </h2>

        {/* ✅ Empty state */}
        {womenProducts.length === 0 ? (
          <p className="text-center text-gray-500">No products found.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {womenProducts.map((product) => (
              <Link
                to={`/product/${product.id}`}
                key={product.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all overflow-hidden"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900">{product.name}</h3>
                  <p className="text-gray-500 text-sm mb-2 line-clamp-2">{product.description}</p>
                  <div className="flex items-center gap-1 text-yellow-500 text-sm mb-2">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={i < Math.round(product.rating) ? "text-yellow-500" : "text-gray-300"}
                      />
                    ))}
                    <span className="text-gray-600 ml-1">{product.rating}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-gray-900 font-bold">${product.price?.toFixed(2)}</p>
                    <button
                      onClick={(e) => {
                        e.preventDefault(); // ✅ prevents Link navigation on button click
                        HandleAddTCart(product, 1, product?.defaultSize, product?.defaultColor);
                      }}
                      className="bg-black text-white text-sm px-3 py-2 rounded-full hover:bg-pink-600 transition"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Women;
