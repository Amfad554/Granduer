import { useContext, useState } from "react";
import { CiMenuFries } from "react-icons/ci";
import { FaShoppingCart, FaUser, FaTachometerAlt } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { Link, NavLink } from "react-router-dom";
import { ProductContext } from "../Context/ProductContext";

const Navbar = () => {
  const { cartCout, isAuthentified, showWarning, setShowWarning, User } = useContext(ProductContext);

  const [isMenuOpen, setIsmenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navlinks = [
    { id: 1, name: "About", path: "/about" },
    { id: 2, name: "Contact", path: "/contact" },
    { id: 3, name: "New Arrivals", path: "/newArrivals" },
    { id: 4, name: "Men", path: "/men" },
    { id: 5, name: "Women", path: "/women" },
    { id: 6, name: "Children", path: "/children" },
  ];

  const HandlMenuOpen = () => setIsmenuOpen((prv) => !prv);

  return (
    <div className="sticky top-0 left-0 z-40">

      {/* ── Inactivity Warning Banner ── */}
      {showWarning && isAuthentified && (
        <div className="w-full bg-yellow-400 text-black text-center text-sm py-2 px-4 flex justify-center items-center gap-4 z-50">
          <span>⚠️ You'll be logged out in 2 minutes due to inactivity. Move your mouse or click anywhere to stay logged in.</span>
          <button
            onClick={() => setShowWarning(false)}
            className="ml-4 text-black font-bold underline text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ── Large Screen ── */}
      <div className="hidden lg:block">
        <div className="w-full bg-primary px-6 lg:px-16 py-6 flex items-center justify-between text-white relative">

          {/* Logo */}
          <Link to="/" className="logo font-bold font-serif italic text-2xl">
            Granduer
          </Link>

          {/* Nav Links */}
          <div className="hidden lg:block">
            <div className="links flex justify-between items-center gap-4">
              {navlinks.map((item) => (
                <NavLink
                  key={item.id}
                  to={item.path}
                  className={({ isActive }) =>
                    isActive
                      ? "border bg-white text-black rounded-3xl p-2 text-sm"
                      : "rounded-3xl p-2 text-sm hover:bg-white hover:text-black transition"
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Search + User + Cart */}
          <div className="flex items-center gap-4 text-sm relative">
            <span
              onClick={() => setSearchOpen((prev) => !prev)}
              className="border border-white bg-black p-2 rounded-3xl cursor-pointer hover:bg-white hover:text-black transition"
            >
              <FiSearch />
            </span>

            {searchOpen && (
              <div className="absolute right-[120px] top-1/2 -translate-y-1/2">
                <div className="flex items-center bg-white border border-gray-300 rounded-3xl overflow-hidden w-64">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="flex-grow px-4 py-2 text-black text-sm outline-none"
                  />
                  <button className="px-3 text-black">
                    <FiSearch />
                  </button>
                </div>
              </div>
            )}

            <NavLink
              to={isAuthentified ? (User?.role === "admin" ? "/AdminDash" : "/userDash") : "/login"}
              className="border border-white bg-black p-2 rounded-3xl hover:bg-white hover:text-black transition cursor-pointer"
            >
              {isAuthentified ? <FaTachometerAlt /> : <FaUser />}
            </NavLink>

            <NavLink
              to="/cart"
              className={({ isActive }) =>
                isActive
                  ? "border bg-white text-black rounded-3xl p-2 text-sm relative"
                  : "border border-white bg-black p-2 rounded-3xl hover:bg-white hover:text-black transition relative"
              }
            >
              <FaShoppingCart />
              <span className="absolute -top-2 -right-3 h-5 w-5 rounded-full bg-white text-primary flex justify-center items-center font-bold text-xs border border-white">
                {cartCout || 0}
              </span>
            </NavLink>
          </div>
        </div>
      </div>

      {/* ── Mobile Screen ── */}
      <div className="lg:hidden block">
        <div className="relative w-full bg-primary px-6 py-6 flex items-center justify-between text-white">

          {searchOpen && (
            <div className="bg-primary py-2 flex justify-center absolute items-center z-20 left-16 w-[50%] md:w-[40%]">
              <div className="flex items-center bg-white border w-full border-gray-300 rounded-3xl overflow-hidden">
                <input
                  type="text"
                  placeholder="Search..."
                  className="flex-grow px-4 py-2 text-black text-sm outline-none"
                />
                <button className="px-3 text-black">
                  <FiSearch />
                </button>
              </div>
            </div>
          )}

          {/* Cart + Search */}
          <div className="flex items-center gap-3">
            <NavLink
              to="/cart"
              className="border border-white bg-black p-2 rounded-3xl text-sm"
            >
              <FaShoppingCart />
            </NavLink>

            <button
              onClick={() => setSearchOpen((prev) => !prev)}
              className="border border-white bg-black p-2 rounded-3xl text-sm"
            >
              <FiSearch />
            </button>
          </div>

          {/* Logo */}
          <Link to="/" className="font-bold font-serif italic text-2xl">
            Granduer
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to={isAuthentified ? (User?.role === "admin" ? "/AdminDash" : "/userDash") : "/login"}
              className="p-4 text-white text-3xl"
            >
              {isAuthentified ? <FaTachometerAlt /> : <FaUser />}
            </Link>

            <span
              onClick={HandlMenuOpen}
              className="cursor-pointer p-4 text-white text-3xl"
            >
              <CiMenuFries />
            </span>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`${isMenuOpen
            ? "max-h-[2000px] opacity-100 block transition duration-500"
            : "max-h-0 opacity-0 hidden transition-all duration-500"
            } absolute left-0 w-full bg-white text-black`}
        >
          <div className="flex flex-col items-center gap-4 p-4">
            {navlinks.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                  isActive
                    ? "bg-black text-white rounded-3xl text-sm p-2 w-full"
                    : "rounded-3xl font-semibold bg-white text-black hover:text-white hover:bg-black transition p-2 w-full"
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;