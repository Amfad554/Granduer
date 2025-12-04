import { useContext, useEffect } from "react";
import { ProductContext } from "./ProductContext";


const Edit = ({
  setSetectedSize,
  setSelectedColor,
  setQuantity,
  prod,
  quantity,
  selectedColor,
  selectedSize,
}) => {
  const { HandleUpdateCart } = useContext(ProductContext);

  // Initialize selected size and color on first render
  useEffect(() => {
    if (prod?.selectedsize) {
      setSetectedSize(prod.selectedsize);
    } else if (prod?.product?.defaultSize) {
      setSetectedSize(prod.product.defaultSize);
    }

    if (prod?.selectedcolor) {
      setSelectedColor(prod.selectedcolor);
    } else if (prod?.product?.defaultColor) {
      setSelectedColor(prod.product.defaultColor);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prod]);

  // Use a currentSize variable to ensure correct highlighting
  const currentSize =
    selectedSize || prod?.selectedsize || prod?.product?.defaultSize || "";

  return (
    <div>
      <p className="text-2xl font-semibold text-center">Edit Cart</p>
      <div className="p-6 max-w-3xl mx-auto bg-white rounded-2xl shadow-md ">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Product Image */}
          <img
            src={prod?.image || prod?.product?.image}
            alt={prod?.name || prod?.product?.name}
            className="w-full md:w-1/2 h-80 object-cover rounded-xl"
          />

          {/* Product Info */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">
              {prod?.name || prod?.product?.name}
            </h1>
            <p className="text-gray-600 mb-3">
              {prod?.description || prod?.product?.description}
            </p>
            <div className="mb-4">
              <p className="text-xl font-semibold text-green-700">
                ${prod?.price || prod?.product?.price}{" "}
                {prod?.discount > 0 && (
                  <span className="text-sm text-red-500 ml-2">
                    ({prod?.discount || prod?.product?.discount}% off)
                  </span>
                )}
              </p>
              <p className="text-sm text-gray-500 uppercase mt-1">
                Category:{" "}
                {prod?.category ? (
                  <>
                    {prod?.category} → {prod?.subcategory}
                  </>
                ) : (
                  <>
                    {prod?.product?.category} → {prod?.product?.subcategory}
                  </>
                )}
              </p>
            </div>

            {/* Sizes */}
            {prod?.product?.sizes && prod.product.sizes.length > 0 ? (
              <div className="mb-4">
                <h2 className="font-semibold mb-1">Select Size:</h2>
                <div className="flex gap-2">
                  {prod.product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSetectedSize(size)}
                      className={`border rounded-md px-3 py-1 text-sm cursor-pointer transition-all 
                        ${
                          currentSize === size
                            ? "bg-black text-white border-black"
                            : "hover:bg-gray-100"
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>No sizes</>
            )}

            {/* Colors */}
            {prod?.colors ? (
              prod?.colors.length > 0 && (
                <div className="mb-4">
                  <h2 className="font-semibold mb-1">Select Color:</h2>
                  <div className="flex gap-3">
                    {prod?.colors.map((color) => (
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
              )
            ) : prod?.product?.colors && prod?.product?.colors.length > 0 ? (
              <div className="mb-4">
                <h2 className="font-semibold mb-1">Select Color:</h2>
                <div className="flex gap-3">
                  {prod?.product?.colors.map((color) => (
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
            ) : (
              <>No colors</>
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
              onClick={(e) => {
                e.preventDefault();
                HandleUpdateCart(prod);
              }}
              className="mt-4 w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-800 transition-all"
            >
              Update Cart
            </button>

            {/* Rating and Best Seller */}
            <div className="flex items-center gap-4 mt-6">
              <p className="text-yellow-500 font-semibold">
                ⭐ {prod?.rating} / 5
              </p>
              {prod?.bestSeller && (
                <span className="bg-orange-500 text-white text-sm px-2 py-1 rounded-md">
                  {prod?.bestSeller && <span>Best Seller</span>}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Edit;