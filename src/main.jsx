import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Women from "./pages/Women.jsx";
import Men from "./pages/Men.jsx";
import Children from "./pages/Children.jsx";
import NewArrivals from "./pages/NewArrivals.jsx";
import Cart from "./pages/Cart.jsx";
import SingleProduct from "./pages/SingleProduct.jsx";
import AdminDash from "./Dashboard/AdminDash.jsx";
import UserDash from "./Dashboard/userDash.jsx";
import ThankYouPage from "./pages/ThankYouPage.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import UserLoginPage from "./pages/UserLogin.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "/about", element: <About /> },
      { path: "/contact", element: <Contact /> },
      { path: "/women", element: <Women /> },
      { path: "/men", element: <Men /> },
      { path: "/children", element: <Children /> },
      { path: "/newarrivals", element: <NewArrivals /> },
      { path: "/cart", element: <Cart /> },
      { path: "/product/:id", element: <SingleProduct /> },
      { path: "/login", element: <UserLoginPage /> },
      { path: "/AdminDash", element: <AdminDash /> },
      { path: "/userDash", element: <UserDash /> },
      { path: "/thankyou", element: <ThankYouPage /> },
      { path: "/verifyemail/:token", element: <VerifyEmail /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);