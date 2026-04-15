import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProductContext } from "../Context/ProductContext";
import Layout from "../Shared/Layout/Layout";
import CreateProduct from "./createProduct";

const INACTIVITY_LIMIT = 30 * 60 * 1000;
const SESSION_LIMIT = 24 * 60 * 60 * 1000;

export default function AdminDash() {
  const { isAuthentified, User, productData, logout, HandleGetProducts } = useContext(ProductContext);
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Role guard — admin only
  useEffect(() => {
    if (!isAuthentified) { navigate("/login"); return; }
    if (User?.role !== "admin") { navigate("/userDash"); }
  }, [isAuthentified, User, navigate]);

  useEffect(() => { HandleGetProducts(); }, []);

  // Session + inactivity timeout
  useEffect(() => {
    if (!isAuthentified) return;
    const checkAndLogout = () => {
      const now = Date.now();
      const loginTime = parseInt(localStorage.getItem("loginTime") || "0");
      const lastActive = parseInt(localStorage.getItem("lastActive") || "0");
      if (loginTime && now - loginTime > SESSION_LIMIT) { logout("session"); return; }
      if (lastActive && now - lastActive > INACTIVITY_LIMIT) { logout("inactivity"); }
    };
    const interval = setInterval(checkAndLogout, 30000);
    return () => clearInterval(interval);
  }, [isAuthentified, logout]);

  const recentProducts = (productData || []).slice(0, 5);

  const navItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "products", label: "Products" },
    { id: "orders", label: "Orders" },
    { id: "users", label: "Users" },
  ];

  return (
    <Layout>
      <div className="flex min-h-screen bg-gray-50">

        {/* Sidebar */}
        <aside className="w-48 bg-black text-white flex flex-col p-4 gap-6 flex-shrink-0">
          <div className="text-base font-medium tracking-widest pb-4 border-b border-white/10">
            GRANDEUR
          </div>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <button key={item.id} onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm text-left transition ${
                  activeTab === item.id ? "bg-white text-black font-medium" : "text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {item.label}
              </button>
            ))}
          </nav>
          <div className="mt-auto">
            <button onClick={() => logout("manual")}
              className="flex items-center gap-2 px-3 py-2 text-sm text-white/40 hover:text-white transition w-full">
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              Log out
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-6">

          <div className="flex items-center justify-between mb-6">
            <h1 className="text-lg font-medium">Admin dashboard</h1>
            <button onClick={() => setShowCreateModal(true)}
              className="bg-black text-white text-sm px-4 py-2 rounded-md hover:bg-gray-800 transition">
              + Add product
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {[
              { label: "Products", value: (productData || []).length },
              { label: "Orders", value: 89 },
              { label: "Users", value: 342 },
              { label: "Revenue", value: "$45,200" },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white border border-gray-200 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">{label}</p>
                <p className="text-2xl font-medium">{value}</p>
              </div>
            ))}
          </div>

          {/* Products table */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h2 className="text-sm font-medium mb-3 pb-2 border-b border-gray-100">Recent products</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400">
                  <th className="text-left pb-2 font-normal">Name</th>
                  <th className="text-left pb-2 font-normal">Price</th>
                  <th className="text-left pb-2 font-normal">Category</th>
                  <th className="text-left pb-2 font-normal">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentProducts.map((prod) => (
                  <tr key={prod.id}>
                    <td className="py-2">{prod.name}</td>
                    <td className="py-2">${prod.price}</td>
                    <td className="py-2 text-gray-500">{prod.subcategory}</td>
                    <td className="py-2">
                      <button className="text-xs underline text-gray-500 hover:text-black transition">
                        Edit
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
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 overflow-auto p-4">
            <div className="bg-white w-full max-w-3xl rounded-xl p-6 relative">
              <button onClick={() => setShowCreateModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-black text-xl transition">
                ✕
              </button>
              <CreateProduct />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}