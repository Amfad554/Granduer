import { useContext } from "react";
import { ProductContext } from "../../Context/ProductContext";

const Edit = ({
  product,
  setSelectedSize,
  selectedSize,
  selectedColor,
  setSelectedColor,
  isInCart,
  currentCartQuantity,
  setQuantity,
  quantity,
  closeModal,
}) => {
  const { HandleUpdateCart } = useContext(ProductContext);

  if (!product) {
    return (
      <div className="flex items-center justify-center h-60 text-gray-500">
        Loading product details...
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] bg-white p-6 md:p-8">
      <h2 className="flex justify-center items-center font-bold text-2xl mb-5">
        Edit Cart
      </h2>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Image */}
        <div className="flex justify-center items-center bg-gray-100 rounded-2xl overflow-hidden p-4">
          <img
            src={product?.image}
            alt={product?.name}
            className="w-full h-64 md:h-full object-contain rounded-xl"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            {product?.name}
          </h1>
          <p className="text-gray-600 mb-3 text-sm md:text-base">
            {product?.description}
          </p>

          <div className="mb-3">
            <p className="text-lg md:text-xl font-semibold text-green-700">
              ${product?.price}{" "}
              {product?.discount > 0 && (
                <span className="text-sm text-red-500 ml-2">
                  ({product?.discount}% off)
                </span>
              )}
            </p>
            <p className="text-xs md:text-sm text-gray-500 uppercase mt-1">
              Category: {product?.category} → {product?.subcategory}
            </p>
          </div>

          {/* Sizes */}
          {product?.sizes && product?.sizes.length > 0 && (
            <div className="mb-3">
              <h2 className="font-semibold mb-1">Select Size:</h2>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`border rounded-md px-3 py-1 text-sm cursor-pointer transition-all 
                    ${
                      selectedSize === size
                        ? "bg-black text-white border-black"
                        : "hover:bg-gray-100 border-gray-300"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {product?.colors && product?.colors.length > 0 && (
            <div className="mb-3">
              <h2 className="font-semibold mb-1">Select Color:</h2>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 cursor-pointer transition-transform duration-200
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

          {/* Cart Status */}
          {isInCart && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-800 font-medium">
                ✓ This item is already in your cart (Quantity:{" "}
                {currentCartQuantity})
              </p>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-5 flex items-center gap-3">
            <h2 className="font-semibold">Quantity:</h2>
            <div className="flex items-center border rounded-md">
              <button
                className="px-3 py-1 text-lg hover:bg-gray-100 transition"
                onClick={() => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))}
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
                className="px-3 py-1 text-lg hover:bg-gray-100 transition"
                onClick={() => setQuantity((prev) => prev + 1)}
              >
                +
              </button>
            </div>
          </div>

          {/* Update Cart Button */}
          {!isInCart ? (
            <button
              onClick={() => {
                HandleUpdateCart(product);
                if (typeof closeModal === "function") closeModal();
              }}
              className="mt-2 w-full py-3 rounded-md transition-all font-medium bg-black hover:bg-gray-800 text-white"
            >
              Update Cart
            </button>
          ) : (
            <div className="mt-2">
              <button
                disabled
                className="w-full py-3 rounded-md font-medium bg-green-100 text-green-700 border-2 border-green-300 cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span className="text-lg">✓</span>
                Updated Cart
              </button>
            </div>
          )}

          {/* Rating and Best Seller */}
          <div className="flex items-center gap-4 mt-5">
            <p className="text-yellow-500 font-semibold">
              ⭐ {product?.rating} / 5
            </p>
            {product?.bestSeller && (
              <span className="bg-orange-500 text-white text-sm px-2 py-1 rounded-md">
                Best Seller
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Edit;
