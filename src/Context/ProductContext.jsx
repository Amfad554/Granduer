import React, { createContext, useState, useEffect, useCallback, useRef } from "react";
import { toast } from "react-toastify";
import { baseUrl } from "../App";
import { useNavigate } from "react-router-dom";

const ProductContext = createContext();

const INACTIVITY_LIMIT = 30 * 60 * 1000;
const SESSION_LIMIT = 24 * 60 * 60 * 1000;

const getLocalData = (item, fallback) => {
  try {
    const storedValue = localStorage.getItem(item);
    if (
      storedValue === null ||
      storedValue === undefined ||
      storedValue === "undefined" ||
      storedValue === "null" ||
      storedValue.trim() === ""
    ) {
      localStorage.removeItem(item);
      return fallback;
    }
    return JSON.parse(storedValue);
  } catch (error) {
    console.error(`Error parsing localStorage key "${item}":`, error);
    localStorage.removeItem(item);
    return fallback;
  }
};

const setLocalData = (key, value) => {
  try {
    if (value === undefined || value === null) {
      localStorage.removeItem(key);
      return;
    }
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving localStorage key "${key}":`, error);
  }
};

const ProductProvide = ({ children }) => {
  const navigate = useNavigate();

  const [productData, setProductData] = useState(null);
  const [isAuthentified, setIsAuthentified] = useState(
    localStorage.getItem("isAuthentified") === "true" &&
    !!localStorage.getItem("token")
  );
  const [cartCout, setCartCount] = useState(0);
  const [favouriteCout, setfavouriteCout] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const [cartItems, setCartItems] = useState(() => getLocalData("cartItems", []));
  const [User, setUser] = useState(() => getLocalData("user", {}));
  const [favoriteItem, setfavoriteItem] = useState(() => getLocalData("favourieCart", []));

  const [token, setToken] = useState(() => {
    const t = localStorage.getItem("token");
    return t && t !== "undefined" && t !== "null" ? t : "";
  });

  const activityTimerRef = useRef(null);
  const sessionTimerRef = useRef(null);
  const warningTimerRef = useRef(null);

  // ─── Logout ───────────────────────────────────────────────────────────────
  const logout = useCallback((reason = "manual") => {
    setIsAuthentified(false);
    setUser({});
    setToken("");
    setCartItems([]);
    setShowWarning(false);

    localStorage.removeItem("isAuthentified");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cartItems");
    localStorage.removeItem("loginTime");
    localStorage.removeItem("lastActive");

    clearTimeout(activityTimerRef.current);
    clearTimeout(sessionTimerRef.current);
    clearTimeout(warningTimerRef.current);

    if (reason === "inactivity") {
      toast.info("You were logged out due to inactivity.");
    } else if (reason === "session") {
      toast.info("Your 24-hour session has expired. Please log in again.");
    }

    navigate("/login");
  }, [navigate]);

  // ─── Reset inactivity timer ───────────────────────────────────────────────
  const resetActivityTimer = useCallback(() => {
    if (!isAuthentified) return;

    setShowWarning(false);
    clearTimeout(activityTimerRef.current);
    clearTimeout(warningTimerRef.current);

    localStorage.setItem("lastActive", Date.now().toString());

    warningTimerRef.current = setTimeout(() => {
      setShowWarning(true);
    }, INACTIVITY_LIMIT - 2 * 60 * 1000);

    activityTimerRef.current = setTimeout(() => {
      logout("inactivity");
    }, INACTIVITY_LIMIT);
  }, [isAuthentified, logout]);

  // ─── Session & inactivity watcher ────────────────────────────────────────
  useEffect(() => {
    if (!isAuthentified) return;

    const now = Date.now();
    const loginTime = parseInt(localStorage.getItem("loginTime") || "0");
    const lastActive = parseInt(localStorage.getItem("lastActive") || "0");

    if (loginTime && now - loginTime > SESSION_LIMIT) { logout("session"); return; }
    if (lastActive && now - lastActive > INACTIVITY_LIMIT) { logout("inactivity"); return; }

    const sessionRemaining = loginTime ? SESSION_LIMIT - (now - loginTime) : SESSION_LIMIT;
    sessionTimerRef.current = setTimeout(() => logout("session"), sessionRemaining);

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, resetActivityTimer));
    resetActivityTimer();

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        const now = Date.now();
        const loginTime = parseInt(localStorage.getItem("loginTime") || "0");
        const lastActive = parseInt(localStorage.getItem("lastActive") || "0");
        if (loginTime && now - loginTime > SESSION_LIMIT) { logout("session"); return; }
        if (lastActive && now - lastActive > INACTIVITY_LIMIT) { logout("inactivity"); return; }
        resetActivityTimer();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearTimeout(activityTimerRef.current);
      clearTimeout(sessionTimerRef.current);
      clearTimeout(warningTimerRef.current);
      events.forEach((e) => window.removeEventListener(e, resetActivityTimer));
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [isAuthentified, logout, resetActivityTimer]);

  // ─── Sync auth state from User + token ───────────────────────────────────
  useEffect(() => {
    if (User && User?.role && token) {
      setIsAuthentified(true);
    } else {
      setIsAuthentified(false);
    }
  }, [User, token]);

  // ─── Cart count ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (cartItems && Array.isArray(cartItems)) {
      const count = cartItems.reduce((acc, curr) => acc + Number(curr?.quantity || 0), 0);
      setCartCount(count);
    }
  }, [cartItems]);

  // ─── Favourite count ──────────────────────────────────────────────────────
  useEffect(() => {
    if (favoriteItem && Array.isArray(favoriteItem)) {
      const count = favoriteItem.reduce((acc, curr) => acc + (curr?.quantity || 0), 0);
      setfavouriteCout(count);
    }
  }, [favoriteItem]);

  // ─── Fetch server cart on login ───────────────────────────────────────────
  useEffect(() => {
    const fetchUserCart = async () => {
      if (isAuthentified && token && User?.userid) {
        try {
          const res = await fetch(`${baseUrl}getcart/${User.userid}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          if (res.ok) {
            const items = data?.data?.ProductCart ?? [];
            if (items.length > 0) {
              setCartItems(items);
              setLocalData("cartItems", items);
            }
          }
        } catch (error) {
          console.error("Failed to fetch server cart:", error);
        }
      }
    };
    fetchUserCart();
  }, [isAuthentified, token, User?.userid]);

  // ─── Get all products ─────────────────────────────────────────────────────
  const HandleGetProducts = async () => {
    try {
      const res = await fetch(`${baseUrl}getAllProduct`, { method: "GET" });
      const data = await res.json();
      if (res.ok) {
        setProductData(data?.data);
        setLocalData("productData", data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => { HandleGetProducts(); }, []);

  // ─── Login helper ─────────────────────────────────────────────────────────
  const handleLoginSuccess = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    setIsAuthentified(true);
    setLocalData("user", userData);
    localStorage.setItem("token", userToken);
    localStorage.setItem("isAuthentified", "true");
    localStorage.setItem("loginTime", Date.now().toString());
    localStorage.setItem("lastActive", Date.now().toString());
  };

  // ─── Add to cart ──────────────────────────────────────────────────────────
  const HandleAddTCart = async (prod, quantity = 1, size = null, color = null) => {
    if (!isAuthentified) {
      let storedCartItems = getLocalData("cartItems", []);
      const existingItem = storedCartItems.find((item) => parseInt(item.id) === parseInt(prod.id));
      let updatedCartItems;
      if (existingItem) {
        updatedCartItems = storedCartItems.map((item) =>
          parseInt(item.id) === parseInt(prod.id)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        toast.info("Existing item quantity added to cart Successfully!");
      } else {
        updatedCartItems = [...storedCartItems, { ...prod, quantity, size, color }];
        toast.success("Item Added to cart Successfully!");
      }
      setLocalData("cartItems", updatedCartItems);
      setCartItems(updatedCartItems);
    } else {
      try {
        const payload = {
          userid: Number(User?.userid),
          productid: Number(prod?.id),
          color, size, quantity,
        };
        const res = await fetch(`${baseUrl}addcart`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok) {
          toast.success(data?.message);
          const items = data?.data?.ProductCart ?? [];
          setLocalData("cartItems", items);
          setCartItems(items);
        } else {
          toast.error(data?.message);
        }
      } catch (error) {
        toast.error("Unable to add to cart, please try again later!");
      }
    }
  };

  // ─── Update cart ──────────────────────────────────────────────────────────
  const HandleUpdateCart = async (prod) => {
    try {
      if (!isAuthentified) {
        const storedCartItems = getLocalData("cartItems", []);
        const existingItem = storedCartItems.find((item) => parseInt(item?.id) === parseInt(prod?.id));
        if (!existingItem) { toast.error("Item does not exist in cart!"); return; }
        const updatedCartItems = storedCartItems.map((item) =>
          parseInt(item?.id) === parseInt(prod?.id)
            ? { ...item, size: prod?.size ?? item?.size, color: prod?.color ?? item?.color, quantity: prod?.quantity ?? item?.quantity }
            : item
        );
        setLocalData("cartItems", updatedCartItems);
        setCartItems(updatedCartItems);
        toast.success("Item Updated Successfully!");
      } else {
        const res = await fetch(`${baseUrl}updatecart`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            userid: Number(User?.userid),
            productid: Number(prod?.product?.id || prod?.productid),
            color: prod?.color, size: prod?.size, quantity: prod?.quantity,
          }),
        });
        const data = await res.json();
        if (res.ok) {
          toast.success(data?.message);
          const items = data?.data?.ProductCart ?? [];
          setLocalData("cartItems", items);
          setCartItems(items);
        } else {
          toast.error(data?.message);
        }
      }
    } catch (error) {
      toast.error("Unable to update cart, please try again later!");
    }
  };

  // ─── Delete from cart ─────────────────────────────────────────────────────
  const HandleDeleteCart = async (id) => {
    try {
      if (!isAuthentified) {
        const storedCartItems = getLocalData("cartItems", []);
        const updatedCartItems = storedCartItems?.filter((item) => parseInt(item.id) !== parseInt(id));
        setLocalData("cartItems", updatedCartItems);
        setCartItems(updatedCartItems);
        toast.success("Item removed from cart!");
      } else {
        const res = await fetch(`${baseUrl}deletecart`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ userid: Number(User?.userid), productid: Number(id) }),
        });
        const data = await res.json();
        if (res.ok) {
          toast.success(data?.message);
          const items = data?.data?.ProductCart ?? [];
          setLocalData("cartItems", items);
          setCartItems(items);
        } else {
          toast.error(data?.message);
        }
      }
    } catch (error) {
      toast.error("Unable to delete cart, please try again later!");
    }
  };

  // ─── Add to favourites ────────────────────────────────────────────────────
  const HandleAddFavouritrCart = (prod) => {
    if (!isAuthentified) {
      let storedFavouriteCart = getLocalData("favourieCart", []);
      const existingItem = storedFavouriteCart?.find((item) => parseInt(item?.id) === parseInt(prod?.id));
      let updatedFavouriteCart;
      if (existingItem) {
        toast.info("Item already in FavouriteCart");
        updatedFavouriteCart = storedFavouriteCart;
      } else {
        updatedFavouriteCart = [...storedFavouriteCart, { ...prod, quantity: 1 }];
        toast.success("Item Added to FavouriteCart Successfully!");
      }
      setLocalData("favourieCart", updatedFavouriteCart);
      setfavoriteItem(updatedFavouriteCart);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        HandleGetProducts, HandleAddTCart, HandleUpdateCart,
        HandleDeleteCart, HandleAddFavouritrCart, handleLoginSuccess,
        logout, productData, cartItems, cartCout, favoriteItem,
        favouriteCout, isAuthentified, setIsAuthentified, loading,
        setLoading, setCartItems, setToken, token, User, setUser,
        showWarning, setShowWarning,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvide;
export { ProductContext };