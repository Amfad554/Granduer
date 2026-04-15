import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ProductContext } from "../Context/ProductContext";
import Layout from "../Shared/Layout/Layout";

const INACTIVITY_LIMIT = 30 * 60 * 1000;
const SESSION_LIMIT = 24 * 60 * 60 * 1000;

export default function UserDash() {
  const { isAuthentified, User, logout, cartItems } = useContext(ProductContext);
  const navigate = useNavigate();

  // Role guard — only regular users
  useEffect(() => {
    if (!isAuthentified) { navigate("/login"); return; }
    if (User?.role === "admin") { navigate("/AdminDash"); }
  }, [isAuthentified, User, navigate]);

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

  const recentOrders = [
    { id: "ORD-20251", item: "Nike Air Max", status: "Delivered", amount: "₦45,000" },
    { id: "ORD-20250", item: "Samsung A14", status: "Processing", amount: "₦120,000" },
    { id: "ORD-20249", item: "Laptop Bag", status: "Pending", amount: "₦9,500" },
  ];

  const statusStyle = {
    Delivered: "bg-green-50 text-green-800",
    Processing: "bg-yellow-50 text-yellow-800",
    Pending: "bg-gray-100 text-gray-600",
    Refunded: "bg-red-50 text-red-700",
  };

  const initials = `${User?.firstname?.[0] || ""}${User?.lastname?.[0] || ""}`.toUpperCase() || "U";

  return (
    <Layout>
      <div className="flex min-h-screen bg-gray-50">

        {/* Sidebar */}
        <aside className="w-48 bg-black text-white flex flex-col p-4 gap-6 flex-shrink-0">
          <div className="text-base font-medium tracking-widest pb-4 border-b border-white/10">
            GRANDEUR
          </div>
          <nav className="flex flex-col gap-1">
            {["Overview", "My orders", "Saved items", "Settings"].map((item, i) => (
              <button key={item}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm text-left transition ${i === 0 ? "bg-white text-black font-medium" : "text-white/60 hover:bg-white/10 hover:text-white"
                  }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {item}
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

          {/* Top bar */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-lg font-medium">Welcome back, {User?.firstname || "User"}</h1>
              <p className="text-xs text-gray-400 mt-0.5">Your account overview</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center text-sm font-medium">
              {initials}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: "Total orders", value: recentOrders.length },
              { label: "Pending delivery", value: recentOrders.filter(o => o.status === "Pending").length },
              { label: "Cart items", value: cartItems?.length || 0 },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white border border-gray-200 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">{label}</p>
                <p className="text-2xl font-medium">{value}</p>
              </div>
            ))}
          </div>

          {/* Orders table */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h2 className="text-sm font-medium mb-3 pb-2 border-b border-gray-100">Recent orders</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400">
                  <th className="text-left pb-2 font-normal">Order</th>
                  <th className="text-left pb-2 font-normal">Item</th>
                  <th className="text-left pb-2 font-normal">Amount</th>
                  <th className="text-left pb-2 font-normal">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map((o) => (
                  <tr key={o.id}>
                    <td className="py-2 text-xs text-gray-500">{o.id}</td>
                    <td className="py-2">{o.item}</td>
                    <td className="py-2">{o.amount}</td>
                    <td className="py-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusStyle[o.status]}`}>
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </Layout>
  );
}