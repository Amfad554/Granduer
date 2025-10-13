import { useContext, useEffect, useState } from "react";
import { ProductContext } from "../Context/ProductContext";
import { useParams } from "react-router-dom";
import Layout from "../Shared/Layout";

const SingleProduct = () => {
  const { id } = useParams();
  const { productData, HandleGetProducts, HandleAddTCart } =
    useContext(ProductContext);
  


  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!productData?.length > 0) {
      HandleGetProducts();
    }
  }, [HandleGetProducts, productData]);

  useEffect(() => {
    if (productData?.length > 0) {
      const found = productData.find(
        (item) => parseInt(item.id) === parseInt(id)
      );
      setProduct(found);
      setSelectedColor(found?.defaultColor || "");
      setSelectedSize(found?.defaultSize || "");
    }
  }, [productData, id]);

  if (!product) {
    return (
      <p className="text-center text-gray-500 mt-10">Loading product...</p>
    );
  }

  return (
    <Layout>
      <div className="p-20">
        <div className="p-6 max-w-3xl mx-auto bg-white rounded-2xl shadow-md ">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Product Image */}
            <img
              src={product.image}
              alt={product.name}
              className="w-full md:w-1/2 h-80 object-cover rounded-xl"
            />

            {/* Product Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-gray-600 mb-3">{product.description}</p>

              <div className="mb-4">
                <p className="text-xl font-semibold text-green-700">
                  ${product.price}{" "}
                  {product.discount > 0 && (
                    <span className="text-sm text-red-500 ml-2">
                      ({product.discount}% off)
                    </span>
                  )}
                </p>
                <p className="text-sm text-gray-500 uppercase mt-1">
                  Category: {product.category} → {product.subcategory}
                </p>
              </div>

              {/* Sizes */}
              {product?.sizes && product?.sizes.length > 0 && (
                <div className="mb-4">
                  <h2 className="font-semibold mb-1">Select Size:</h2>
                  <div className="flex gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`border rounded-md px-3 py-1 text-sm cursor-pointer transition-all 
                      ${
                        selectedSize === size
                          ? "bg-black text-white border-black"
                          : "hover:bg-gray-100"
                      }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-4">
                  <h2 className="font-semibold mb-1">Select Color:</h2>
                  <div className="flex gap-3">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-7 h-7 rounded-full border-2 cursor-pointer transition-all
                      ${
                        selectedColor === color
                          ? "border-black scale-110"
                          : "border-gray-300 hover:scale-105"
                      }`}
                        style={{ backgroundColor: color }}
                        title={color}
                      ></button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-4 flex items-center gap-3">
                <h2 className="font-semibold">Quantity:</h2>
                <div className="flex items-center border rounded-md">
                  <button
                    className="px-3 py-1 text-lg"
                    onClick={() =>
                      setQuantity((prev) => (prev > 1 ? prev - 1 : 1))
                    }
                  >
                    -
                  </button>

                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value > 0) setQuantity(value);
                    }}
                    className="w-16 text-center outline-none px-2 py-1"
                  />

                  <button
                    className="px-3 py-1 text-lg"
                    onClick={() => setQuantity((prev) => prev + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <button
                onClick={() =>  HandleAddTCart(product, quantity, selectedSize, selectedColor )}
                className="mt-4 w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-all"
              >
                Add to Cart
              </button>

              {/* Rating and Best Seller */}
              <div className="flex items-center gap-4 mt-6">
                <p className="text-yellow-500 font-semibold">
                  ⭐ {product.rating} / 5
                </p>
                {product.bestSeller && (
                  <span className="bg-orange-500 text-white text-sm px-2 py-1 rounded-md">
                    {product?.bestSeller && <span>Best Seller</span>}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SingleProduct;