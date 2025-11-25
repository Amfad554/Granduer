import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import Layout from "../Shared/Layout/Layout";

// UserDash.jsx — Black & White Theme (No borders except stats)

export default function UserDash() {
  const recentOrders = [
    {
      id: "ORD-20251",
      item: "Nike Air Max",
      status: "Delivered",
      amount: "₦45,000",
    },
    {
      id: "ORD-20250",
      item: "Samsung A14",
      status: "Processing",
      amount: "₦120,000",
    },
    {
      id: "ORD-20249",
      item: "Laptop Bag",
      status: "Pending",
      amount: "₦9,500",
    },
    {
      id: "ORD-20248",
      item: "PS5 Controller",
      status: "Refunded",
      amount: "₦28,000",
    },
  ];

  const savedItems = [
    { id: 1, item: "Black Hoodie", price: "₦15,000" },
    { id: 2, item: "Wireless Earbuds", price: "₦19,500" },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-white text-black">
        <div className="max-w-[1400px] mx-auto p-4 md:p-6">
          {/* Header */}
          <header className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <img
                src="https://i.pravatar.cc/60?img=12"
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h1 className="text-lg font-semibold">Welcome Back</h1>
                <p className="text-sm text-gray-600">Your dashboard overview</p>
              </div>
            </div>
          </header>

          <main className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <aside className="lg:col-span-1 bg-gray-100 rounded-xl p-4">
              <nav className="space-y-2">
                <NavItem label="Dashboard" active />
                <NavItem label="My Orders" />
                <NavItem label="Saved Items" />
                <NavItem label="Addresses" />
                <NavItem label="Account Settings" />
              </nav>
            </aside>

            {/* Main Section */}
            <section className="lg:col-span-3 space-y-6">
              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                <StatCard label="Pending Deliveries" value="3" />
                <StatCard label="Total Orders" value="18" />
                <StatCard label="Saved Items" value={savedItems.length} />
              </motion.div>

              {/* Saved Items */}
              <div className="bg-gray-100 rounded-xl p-4">
                <h3 className="text-sm font-medium mb-2">Saved Items</h3>
                <div className="space-y-2">
                  {savedItems.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between py-2 border-b last:border-0 border-gray-300"
                    >
                      <div className="text-sm font-medium">{s.item}</div>
                      <div className="text-sm">{s.price}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-gray-100 rounded-xl p-4 overflow-x-auto">
                <h3 className="text-sm font-medium mb-3">Recent Orders</h3>
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="px-3 py-2">Order ID</th>
                      <th className="px-3 py-2">Item</th>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((r) => (
                      <tr
                        key={r.id}
                        className="border-b border-gray-300 last:border-0"
                      >
                        <td className="px-3 py-3 font-medium">{r.id}</td>
                        <td className="px-3 py-3">{r.item}</td>
                        <td className="px-3 py-3">{r.status}</td>
                        <td className="px-3 py-3">{r.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </main>
        </div>
      </div>
    </Layout>
  );
}

// Sidebar Nav Item
function NavItem({ label, active }) {
  return (
    <button
      className={`w-full flex items-center justify-between px-3 py-2 rounded-md ${
        active
          ? "bg-black text-white font-medium"
          : "bg-white text-black hover:bg-black hover:text-white transition"
      }`}
    >
      <span className="text-sm">{label}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 text-gray-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 5l7 7-7 7"
        />
      </svg>
    </button>
  );
}

// Quick Stat Card (keeps black border)
function StatCard({ label, value }) {
  return (
    <div className="bg-white border border-black rounded-xl p-4 text-center">
      <div className="text-xs text-gray-600">{label}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
    </div>
  );
}
