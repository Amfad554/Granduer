import { useContext, useEffect } from "react";
import { ProductContext } from "./ProductContext";

const Edit = ({
  setSelectedSize,
  setSelectedColor,
  setQuantity,
  prod,
  quantity,
  selectedColor,
  selectedSize,
  onClose,
}) => {
  const { HandleUpdateCart } = useContext(ProductContext);

  // prod is a ProductCart row — prod.id is the ProductCart row's primary key
  // prod.Product is the joined product data from the server
  const product = prod?.Product || prod;

  const name = product?.name ?? "";
  const image = product?.image ?? "";
  const description = product?.description ?? "";
  const price = product?.price ?? prod?.price ?? 0;
  const discount = product?.discount ?? prod?.discount ?? 0;
  const category = product?.category ?? prod?.category ?? "";
  const subcategory = product?.subcategory ?? prod?.subcategory ?? "";
  const sizes = product?.sizes ?? [];
  const colors = product?.colors ?? [];
  const rating = product?.rating ?? prod?.rating ?? "";
  const bestSeller = product?.bestSeller ?? prod?.bestSeller ?? false;

  // Initialize size/color/quantity from the saved cart row when the modal opens
  useEffect(() => {
    setSelectedSize(prod?.selectedsize ?? prod?.size ?? sizes[0] ?? "");
    setSelectedColor(prod?.selectedcolor ?? prod?.color ?? colors[0] ?? "");
    setQuantity(prod?.quantity ?? 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prod]);

  const handleUpdate = (e) => {
    e.preventDefault();

    console.log("Sending update — cartItemId:", prod?.id, "product:", product?.id);

    HandleUpdateCart({
      cartItemId: prod?.id,
      tempId: prod?.tempId,        // ← ADD THIS so guest items can match by tempId
      productid: product?.id,
      size: selectedSize,
      color: selectedColor,
      quantity: quantity,
    });

    onClose();
  };

  return (
    <div>
      <p className="text-2xl font-semibold text-center mb-4">Edit Cart</p>
      <div className="p-6 max-w-3xl mx-auto bg-white rounded-2xl shadow-md">
        <div className="flex flex-col md:flex-row gap-6">

          {/* Product Image */}
          <img
            src={image}
            alt={name}
            className="w-full md:w-1/2 h-80 object-cover rounded-xl"
          />

          {/* Product Info */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{name}</h1>
            <p className="text-gray-600 mb-3">{description}</p>

            <div className="mb-4">
              <p className="text-xl font-semibold text-green-700">
                ${price}{" "}
                {discount > 0 && (
                  <span className="text-sm text-red-500 ml-2">
                    ({discount}% off)
                  </span>
                )}
              </p>
              <p className="text-sm text-gray-500 uppercase mt-1">
                Category: {category} → {subcategory}
              </p>
            </div>

            {/* Sizes */}
            {sizes.length > 0 ? (
              <div className="mb-4">
                <h2 className="font-semibold mb-1">Select Size:</h2>
                <div className="flex gap-2 flex-wrap">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`border rounded-md px-3 py-1 text-sm cursor-pointer transition-all
                        ${selectedSize === size
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
              <p className="text-sm text-gray-400 mb-4">No sizes available</p>
            )}

            {/* Colors */}
            {colors.length > 0 ? (
              <div className="mb-4">
                <h2 className="font-semibold mb-1">Select Color:</h2>
                <div className="flex gap-3 flex-wrap">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-7 h-7 rounded-full border-2 cursor-pointer transition-all
                        ${selectedColor === color
                          ? "border-black scale-110"
                          : "border-gray-300 hover:scale-105"
                        }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400 mb-4">No colors available</p>
            )}

            {/* Quantity */}
            <div className="mb-4 flex items-center gap-3">
              <h2 className="font-semibold">Quantity:</h2>
              <div className="flex items-center border rounded-md">
                <button
                  className="px-3 py-1 text-lg"
                  onClick={() => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))}
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val) && val > 0) setQuantity(val);
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

            {/* Update Button */}
            <button
              onClick={handleUpdate}
              className="mt-4 w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-all"
            >
              Update Cart
            </button>

            {/* Rating */}
            <div className="flex items-center gap-4 mt-6">
              {rating && (
                <p className="text-yellow-500 font-semibold">⭐ {rating} / 5</p>
              )}
              {bestSeller && (
                <span className="bg-orange-500 text-white text-sm px-2 py-1 rounded-md">
                  Best Seller
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