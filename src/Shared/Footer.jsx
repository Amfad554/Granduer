import { Link, NavLink } from "react-router-dom";
import Input from "../shared/Input";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-primary text-gray-300  md:px-16 pt-12 pb-6">
      {/* Top section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-b border-gray-700 pb-10">
        {/* Column 1 */}
        <div>
          <h3 className="text-white font-semibold mb-4">Company</h3>
          <p className="text-sm leading-6">
            Find a location nearest you. <br />
            See our stores
          </p>
          <p className="text-sm mt-3">+8801701253995</p>
          <p className="text-sm text-gray-500">sujon.co@gmail.com</p>
        </div>

        {/* Column 2 */}
        <div>
          <h3 className="text-white font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-sm flex flex-col">
            <li>Shop</li>
            <NavLink to={"/login"}>Account</NavLink>
            <NavLink to={"/cart"}>Cart</NavLink>
            <li>Checkout</li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h3 className="text-white font-semibold mb-4">Services</h3>
          <ul className="space-y-2 text-sm flex flex-col">
            <NavLink to={"/about"}>About us</NavLink>
            <NavLink to={"/men"}>Men</NavLink>
            <NavLink to={"/women"}>Women</NavLink>
            <NavLink to={"/privacy-policy"}>Privacy policy</NavLink>
          </ul>
        </div>

        {/* Column 4 – Newsletter */}
        <div>
          <h3 className="text-white font-semibold mb-4">
            Get Our News And Updates
          </h3>

          <div className="flex items-center gap-2 mb-3">
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              className="w-full rounded-lg outline-none border p-2 border-gray-400 bg-primary text-white focus:ring-2 focus:ring-black"
            />

            <button className="bg-white text-black rounded-full px-6 py-2 font-medium text-sm whitespace-nowrap">
              Subscribe
            </button>
          </div>

          <p className="text-xs text-gray-500 mb-3">
            By subscribing you agree to our{" "}
            <span className="underline text-gray-400 cursor-pointer">
              Privacy Policy
            </span>
          </p>

          <div className="flex space-x-4 text-gray-400 text-lg">
            <FaFacebookF className="hover:text-white cursor-pointer" />
            <FaInstagram className="hover:text-white cursor-pointer" />
            <FaTwitter className="hover:text-white cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="flex flex-col md:flex-row items-center justify-between mt-6 text-sm text-gray-500">
        <div className="flex space-x-3 mb-3 md:mb-0">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
            alt="Visa"
            className="h-5"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg"
            alt="Mastercard"
            className="h-5"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/5a/Discover_Card_logo.svg"
            alt="Discover"
            className="h-5"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
            alt="PayPal"
            className="h-5"
          />
        </div>

        <div className="flex items-center justify-between ">
          <Link
            to={"/"}
            className="logo rounded-full text-white bg-black p-2 font-bold text-2xl font-serif"
          >
            <i className="mr-16">Granduer</i>
          </Link>
          <p>@2024 Theme by anariel design. Proudly powered by WordPress.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
