import { useContext, useState } from "react";
import { CiMenuFries } from "react-icons/ci";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { Link, NavLink } from "react-router-dom";
import { ProductContext } from "../Context/ProductContext";

const Navbar = () => {
  const { cartcout } = useContext(ProductContext);

  const navlinks = [
    { id: 1, name: "About", path: "/about" },
    { id: 2, name: "Contact", path: "/contact" },
    { id: 3, name: "New Arrivals", path: "/newArrivals" },
    { id: 4, name: "Men", path: "/men" },
    { id: 5, name: "Women", path: "/women" },
    { id: 6, name: "Children", path: "/children" },
  ];

  const [isMenuOpen, setIsmenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const HandlMenuOpen = () => {
    setIsmenuOpen((prv) => !prv);
  };

  return (
    <div className="sticky top-0 left-0 z-40">
      {/* LargeScreenNav */}
      <div className="hidden lg:block">
        <div className="w-full bg-primary px-6 lg:px-16 py-6 flex items-center justify-between text-white relative">
          <Link to={"/"} className="logo font-bold font-serif italic text-2xl">
            Granduer
          </Link>

          {/* Nav Links */}
          <div className="hidden lg:block">
            <div className="links flex justify-between items-center gap-4">
              {navlinks.map((item) => (
                <NavLink
                  className={({ isActive }) =>
                    isActive
                      ? "border-[1px] bg-white text-black rounded-3xl p-[10px] text-sm"
                      : "rounded-3xl p-[10px] text-sm hover:bg-white hover:text-black transition ease-in-out duration-700"
                  }
                  to={item.path}
                  key={item.id}
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Right Section (Search + User + Cart) */}
          <div className="flex items-center gap-4 text-sm relative">
            {/* Search icon */}
            <span
              onClick={() => setSearchOpen((prev) => !prev)}
              className="border-[1px] border-white bg-black p-[7px] text-sm hover:bg-white hover:text-black transition ease-in-out duration-300 rounded-3xl cursor-pointer"
            >
              <FiSearch />
            </span>

            {/* Search input (toggles on click) */}
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

            {/* Login */}
            <NavLink
              to="/login"
              className="border-[1px] border-white bg-black p-[7px] text-sm hover:bg-white hover:text-black transition ease-in-out duration-300 rounded-3xl cursor-pointer"
            >
              <FaUser />
            </NavLink>

            {/* Cart */}
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? "border-[1px] bg-white text-black rounded-3xl p-[10px] cart text-sm relative"
                  : "border-[1px] z-10 border-white bg-black p-[7px] text-sm hover:bg-white cart hover:text-black transition ease-in-out duration-300 rounded-3xl relative"
              }
              to={"/cart"}
            >
              <FaShoppingCart />
              <span className="absolute border-[1px] border-white count -top-2 -right-3 h-5 w-5 p-2 rounded-full bg-white text-primary flex justify-center items-center font-bold">
                {(cartcout && cartcout) || 0}
              </span>
            </NavLink>
          </div>

          {/* Menu Icon */}
          <span className="flex justify-center items-center p-4 lg:hidden h-16 w-16 rounded-md text-white text-3xl font-bold">
            <CiMenuFries />
          </span>
        </div>
      </div>

      {/* SmallScreen */}
      <div className="lg:hidden block">
        <div className="relative w-full bg-primary px-6 lg:px-16 py-6 flex items-center justify-between text-white">
          {searchOpen && (
            <div className="bg-primary py-2 flex justify-center absolute items-center z-20 left-16 md:left-[30%] w-[50%] md:w-[40%]">
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

          <div className="flex relative items-center gap-3 lg:hidden">
            <NavLink
              to={"/cart"}
              className={`${
                searchOpen ? "md:block hidden" : ""
              } border-[1px] border-white bg-black p-[7px] rounded-3xl text-sm`}
            >
              <FaShoppingCart />
            </NavLink>
            <button
              onClick={() => setSearchOpen((prev) => !prev)}
              className="border-[1px] relative z-40 border-white bg-black p-[7px] rounded-3xl text-sm"
            >
              <FiSearch />
            </button>
          </div>

          {/* logo */}
          <Link to={"/"} className="logo font-bold font-serif italic text-2xl">
            Granduer
          </Link>

          {/* Menu and user */}
          <div className="flex justify-center items-center gap-4">
            <Link
              to={"/login"}
              className="flex justify-center items-center p-4 lg:hidden h-16 w-16 rounded-md text-white text-3xl font-bold"
            >
              <FaUser />
            </Link>

            <span
              onClick={() => HandlMenuOpen()}
              className="flex cursor-pointer justify-center items-center p-4 lg:hidden h-16 w-16 rounded-md text-white text-3xl font-bold"
            >
              <CiMenuFries />
            </span>
          </div>

          {/* Mobile Nav */}
          <div
            className={`${
              isMenuOpen
                ? "max-h-[2000px] opacity-100 transition ease-in-out duration-500 block"
                : "max-h-0 opacity-0 hidden transition-all ease-in-out duration-500"
            } absolute left-0 top-[100%] w-full`}
          >
            <div className="flex flex-col justify-center items-center bg-white text-black w-full gap-4 p-4">
              {navlinks.map((item) => (
                <NavLink
                  className={({ isActive }) =>
                    isActive
                      ? "border-[1px] text-white rounded-3xl text-sm bg-black w-full p-2"
                      : "rounded-3xl md:text-sm sm:text-lg lg:font-medium font-semibold bg-white text-black hover:text-white hover:bg-black transition ease-in-out duration-300 p-2 w-full"
                  }
                  to={item.path}
                  key={item.id}
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
