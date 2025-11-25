import { useState, useContext, useEffect } from "react";
import { ProductContext } from "../Context/ProductContext";
import {
  FaPlusCircle,
  FaList,
  FaBox,
  FaShoppingCart,
  FaUsers,
  FaTachometerAlt,
} from "react-icons/fa";
import CreateProduct from "./createProduct";
import Layout from "../Shared/Layout/Layout";

const Dashboard = () => {
  const { filteredProducts, HandleGetProducts, HandleAddTCart, cartCount } =
    useContext(ProductContext);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAllProductsModal, setShowAllProductsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    HandleGetProducts();
  }, []);

  // Safe slice to avoid undefined errors
  const recentProducts = (filteredProducts || []).slice(0, 5);

  const openEditModal = (prod) => {
    setSelectedProduct(prod);
    setSelectedSize(prod?.defaultSize || prod?.sizes?.[0] || "");
    setSelectedColor(prod?.defaultColor || prod?.colors?.[0] || "");
    setQuantity(1);
    setShowEditModal(true);
  };

  return (
    <Layout>
      <div className="md:flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-primary text-white flex flex-col p-4 md:p-6 text-center md:text-left">
          <h2 className="text-2xl font-bold mb-6">Granduer Admin</h2>
          <nav className="flex flex-col gap-3 w-full">
            <a
              href="#"
              className="flex items-center gap-3 hover:text-black hover:bg-white p-3 rounded-md transition w-full justify-center md:justify-start"
            >
              <FaTachometerAlt /> Dashboard
            </a>
            <a
              href="#"
              className="flex items-center gap-3 hover:text-black hover:bg-white p-3 rounded-md transition w-full justify-center md:justify-start"
            >
              <FaBox /> Manage Products
            </a>
            <a
              href="#"
              className="flex items-center gap-3 hover:text-black hover:bg-white p-3 rounded-md transition w-full justify-center md:justify-start"
            >
              <FaUsers /> Users
            </a>
            <a
              href="#"
              className="flex items-center gap-3 hover:text-black hover:bg-white p-3 rounded-md transition w-full justify-center md:justify-start"
            >
              <FaShoppingCart /> Orders
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

          {/* Stats Cards */}
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[
              {
                title: "Total Products",
                icon: FaBox,
                value: (filteredProducts || []).length,
              },
              { title: "Orders", icon: FaShoppingCart, value: 89 },
              { title: "Users", icon: FaUsers, value: 342 },
              { title: "Revenue", icon: FaTachometerAlt, value: 45200 },
            ].map((card, index) => {
              const Icon = card.icon;
              return (
                <div key={index} className="bg-white shadow-md rounded-xl p-6">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className="text-primary text-3xl" />
                      <h3 className="font-semibold">{card.title}</h3>
                    </div>
                    <p className="text-xl font-bold">
                      {card.title === "Revenue"
                        ? `$${card.value}`
                        : card.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center hover:shadow-xl transition"
            >
              <FaPlusCircle className="text-primary text-4xl mb-3" />
              <h3 className="text-xl font-semibold">Add Product</h3>
            </button>

            <button
              onClick={() => setShowAllProductsModal(true)}
              className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center hover:shadow-xl transition"
            >
              <FaList className="text-primary text-4xl mb-3" />
              <h3 className="text-xl font-semibold">View All Products</h3>
            </button>
          </div>

          {/* Recent Products Table */}
          <div className="bg-white shadow-md rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">Recent Products</h2>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border-b p-2">Name</th>
                  <th className="border-b p-2">Price</th>
                  <th className="border-b p-2">Category</th>
                  <th className="border-b p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-gray-100">
                    <td className="p-2">{prod.name}</td>
                    <td className="p-2">${prod.price}</td>
                    <td className="p-2">{prod.subcategory}</td>
                    <td className="p-2">
                      <button
                        onClick={() => openEditModal(prod)}
                        className="bg-primary text-white px-3 py-1 rounded"
                      >
                        View / Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>

        {/* Create Product Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 overflow-auto">
            <div className="bg-white w-full max-w-5xl rounded-xl p-6 relative">
              <button
                onClick={() => setShowCreateModal(false)}
                className="absolute top-3 right-3 text-gray-600 font-bold"
              >
                X
              </button>
              <CreateProduct />
            </div>
          </div>
        )}

        {/* Edit Product Modal */}
        {showEditModal && selectedProduct && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-start z-50 overflow-auto pt-10">
            <div className="bg-white w-full max-w-5xl rounded-xl p-6 relative shadow-lg">
              <button
                onClick={() => setShowEditModal(false)}
                className="absolute top-3 right-3 text-gray-600 font-bold text-xl hover:text-red-500"
              >
                ✕
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Product Image */}
                <div className="flex-1 bg-gray-100 rounded-2xl overflow-hidden">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Details */}
                <div className="flex flex-col">
                  <h2 className="text-2xl font-bold mb-4">
                    {selectedProduct.name}
                  </h2>
                  <p className="text-gray-600 mb-3">
                    {selectedProduct.description}
                  </p>
                  <p className="text-xl font-semibold mb-2">
                    ${selectedProduct.price}{" "}
                    {selectedProduct.discount > 0 && (
                      <span className="text-sm text-red-500 ml-2">
                        ({selectedProduct.discount}% off)
                      </span>
                    )}
                  </p>

                  {/* Sizes */}
                  {selectedProduct.sizes?.length > 0 && (
                    <div className="mb-4">
                      <h3 className="font-semibold mb-1">Select Size:</h3>
                      <div className="flex gap-2">
                        {selectedProduct.sizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`border rounded-md px-3 py-1 text-sm cursor-pointer ${
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
                  {selectedProduct.colors?.length > 0 && (
                    <div className="mb-4">
                      <h3 className="font-semibold mb-1">Select Color:</h3>
                      <div className="flex gap-2">
                        {selectedProduct.colors.map((color) => (
                          <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`w-7 h-7 rounded-full border-2 cursor-pointer ${
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
                          setQuantity(
                            Math.max(parseInt(e.target.value) || 1, 1)
                          )
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

                  {/* Add to Cart */}
                  <button
                    onClick={() =>
                      HandleAddTCart(
                        selectedProduct,
                        quantity,
                        selectedSize,
                        selectedColor
                      )
                    }
                    className="mt-4 w-full py-3 rounded-md text-white bg-black hover:bg-gray-800"
                  >
                    Add to Cart ({cartCount})
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View All Products Modal */}
        {showAllProductsModal && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-start z-50 overflow-auto pt-10">
            <div className="bg-white w-full max-w-6xl rounded-xl p-6 relative shadow-lg">
              <button
                onClick={() => setShowAllProductsModal(false)}
                className="absolute top-3 right-3 text-gray-600 font-bold text-xl hover:text-red-500"
              >
                ✕
              </button>

              <h2 className="text-2xl font-bold mb-4">All Products</h2>

              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="border-b p-2">Name</th>
                    <th className="border-b p-2">Price</th>
                    <th className="border-b p-2">Category</th>
                    <th className="border-b p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(filteredProducts || []).map((prod) => (
                    <tr key={prod.id} className="hover:bg-gray-100">
                      <td className="p-2">{prod.name}</td>
                      <td className="p-2">${prod.price}</td>
                      <td className="p-2">{prod.subcategory}</td>
                      <td className="p-2">
                        <button
                          onClick={() => {
                            setShowAllProductsModal(false);
                            openEditModal(prod);
                          }}
                          className="bg-primary text-white px-3 py-1 rounded"
                        >
                          View / Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
