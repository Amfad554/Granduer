import { useContext } from "react";
import { ProductContext } from "./ProductContext";

const Edit = () => {
  const {
    selectedProduct: product,
    quantity,
    setQuantity,
    selectedSize,
    setSelectedSize,
    selectedColor,
    setSelectedColor,
    cart = [], // default empty array
    HandleUpdateCart,
  } = useContext(ProductContext);

  if (!product) return null;

  const isInCart = cart.some((item) => item.id === product.id);
  const currentCartQuantity =
    cart.find((item) => item.id === product.id)?.quantity || 0;

  const handleUpdate = () => {
    HandleUpdateCart({
      ...product,
      quantity,
      selectedSize,
      selectedColor,
    });
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <h2 className="text-2xl font-bold mb-4">{product.name}</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex-1 bg-gray-100 rounded-2xl overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col">
          <p className="text-gray-600 mb-3">{product.description}</p>
          <p className="text-xl font-semibold mb-2">
            ${product.price}{" "}
            {product.discount > 0 && (
              <span className="text-sm text-red-500 ml-2">
                ({product.discount}% off)
              </span>
            )}
          </p>

          {/* Sizes */}
          {product.sizes?.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold mb-1">Select Size:</h3>
              <div className="flex gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`border rounded-md px-3 py-1 text-sm ${
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
          {product.colors?.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold mb-1">Select Color:</h3>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-7 h-7 rounded-full border-2 cursor-pointer transition-transform duration-150 ${
                      selectedColor === color
                        ? "border-black scale-110"
                        : "border-gray-300 hover:scale-105"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-4 flex items-center gap-3">
            <h3 className="font-semibold">Quantity:</h3>
            <div className="flex items-center border rounded-md">
              <button
                className="px-3 py-1"
                onClick={() => setQuantity(Math.max(quantity - 1, 1))}
              >
                -
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(parseInt(e.target.value) || 1, 1))
                }
                className="w-16 text-center outline-none px-2 py-1"
              />
              <button
                className="px-3 py-1"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleUpdate}
            disabled={isInCart}
            className={`mt-4 w-full py-3 rounded-md text-white transition-colors duration-200 ${
              isInCart
                ? "bg-green-500 cursor-not-allowed"
                : "bg-black hover:bg-gray-800"
            }`}
          >
            {isInCart ? "Cart Updated" : "Update Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Edit;
