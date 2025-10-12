import React, { useContext, useEffect, useState } from "react";
import { ProductContext } from "../Context/ProductContext";

import { FaStar } from "react-icons/fa";
import Layout from "../shared/Layout";

const NewArrivals = () => {
  const { productData, HandleGetProducts } = useContext(ProductContext);
  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    if (!productData) {
      HandleGetProducts();
      return;
    }

    const filtered = productData.filter((item) => item.newArrival === true);
    setNewArrivals(filtered);
  }, [productData, HandleGetProducts]);

  // Loading state (optional)
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
          New Arrivals
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {newArrivals.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all overflow-hidden"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900">
                  {product.name}
                </h3>
                <p className="text-gray-500 text-sm mb-2 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center gap-2 mb-2">
                  <FaStar className="text-yellow-400" />
                  <span className="text-gray-700">{product.rating}</span>
                </div>

                <p className="text-gray-900 font-bold">
                  ${product.price.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default NewArrivals;
