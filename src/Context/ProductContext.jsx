import React, { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { baseUrl } from "../App";

const ProductContext = createContext();

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
  const [productData, setProductData] = useState(null);

  const [isAuthentified, setIsAuthentified] = useState(
    localStorage.getItem("isAuthentified") === "true"
  );

  const [cartCout, setCartCount] = useState(0);
  const [favouriteCout, setfavouriteCout] = useState(0);
  const [loading, setLoading] = useState(false);

  const [cartItems, setCartItems] = useState(() => getLocalData("cartItems", []));
  const [User, setUser] = useState(() => getLocalData("user", {}));
  const [favoriteItem, setfavoriteItem] = useState(() => getLocalData("favourieCart", []));

  const [token, setToken] = useState(() => {
    const t = localStorage.getItem("token");
    return t && t !== "undefined" && t !== "null" ? t : "";
  });

  // ─── Sync auth state from User ────────────────────────────────────────────
  useEffect(() => {
    console.log("UserContext:", User);
    if (User && User?.role) {
      setIsAuthentified(true);
    }
  }, [User]);

  // ─── Cart count ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (cartItems && Array.isArray(cartItems)) {
      const count = cartItems.reduce((acc, curr) => {
        const qty = curr?.quantity || 0;
        return acc + Number(qty);
      }, 0);
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
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await res.json();
          console.log("Server cart response:", res.status, data);

          if (res.ok) {
            const items = data?.data?.ProductCart ?? []; // ✅ Fixed casing
            if (items.length > 0) {
              setCartItems(items);
              setLocalData("cartItems", items);
            }
          }
          // ✅ On failure, keep existing localStorage cart
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
        console.log(data);
        setProductData(data?.data);
        setLocalData("productData", data);
      } else {
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    HandleGetProducts();
  }, []);

  // ─── Add to cart ──────────────────────────────────────────────────────────
  const HandleAddTCart = async (prod, quantity = 1, size = null, color = null) => {
    if (!isAuthentified) {
      let storedCartItems = getLocalData("cartItems", []);
      const existingItem = storedCartItems.find(
        (item) => parseInt(item.id) === parseInt(prod.id)
      );

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
          color,
          size,
          quantity,
        };

        const res = await fetch(`${baseUrl}addcart`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (res.ok) {
          toast.success(data?.message);
          const items = data?.data?.ProductCart ?? []; // ✅ Fixed casing
          setLocalData("cartItems", items);
          setCartItems(items);
        } else {
          toast.error(data?.message);
          // ✅ Don't touch cartItems on failure
        }
      } catch (error) {
        console.log("error", error.message);
        toast.error("Unable to add to cart, please try again later!");
      }
    }
  };

  // ─── Update cart ──────────────────────────────────────────────────────────
  const HandleUpdateCart = async (prod) => {
    try {
      if (!isAuthentified) {
        const storedCartItems = getLocalData("cartItems", []);
        const existingItem = storedCartItems.find(
          (item) => parseInt(item?.id) === parseInt(prod?.id)
        );

        if (!existingItem) {
          toast.error("Item does not exist in cart!");
          return;
        }

        const updatedCartItems = storedCartItems.map((item) =>
          parseInt(item?.id) === parseInt(prod?.id)
            ? {
              ...item,
              size: prod?.size ?? item?.size,
              color: prod?.color ?? item?.color,
              quantity: prod?.quantity ?? item?.quantity,
            }
            : item
        );

        setLocalData("cartItems", updatedCartItems);
        setCartItems(updatedCartItems);
        toast.success("Item Updated Successfully!");
      } else {
        const res = await fetch(`${baseUrl}updatecart`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userid: Number(User?.userid),
            productid: Number(prod?.product?.id || prod?.productid),
            color: prod?.color,
            size: prod?.size,
            quantity: prod?.quantity,
          }),
        });

        const data = await res.json();
        if (res.ok) {
          toast.success(data?.message);
          const items = data?.data?.ProductCart ?? []; // ✅ Fixed casing
          setLocalData("cartItems", items);
          setCartItems(items);
        } else {
          toast.error(data?.message);
        }
      }
    } catch (error) {
      console.log(error.message);
      toast.error("Unable to update cart, please try again later!");
    }
  };

  // ─── Delete from cart ─────────────────────────────────────────────────────
  const HandleDeleteCart = async (id) => {
    try {
      if (!isAuthentified) {
        const storedCartItems = getLocalData("cartItems", []);
        const updatedCartItems = storedCartItems?.filter(
          (item) => parseInt(item.id) !== parseInt(id)
        );

        setLocalData("cartItems", updatedCartItems);
        setCartItems(updatedCartItems);
        toast.success("Item removed from cart!");
      } else {
        const res = await fetch(`${baseUrl}deletecart`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userid: Number(User?.userid),
            productid: Number(id),
          }),
        });

        const data = await res.json();
        if (res.ok) {
          toast.success(data?.message);
          const items = data?.data?.ProductCart ?? []; // ✅ Fixed casing
          setLocalData("cartItems", items);
          setCartItems(items);
        } else {
          toast.error(data?.message);
        }
      }
    } catch (error) {
      console.log("error", error.message);
      toast.error("Unable to delete cart, please try again later!");
    }
  };

  // ─── Add to favourites ────────────────────────────────────────────────────
  const HandleAddFavouritrCart = (prod) => {
    if (!isAuthentified) {
      let storedFavouriteCart = getLocalData("favourieCart", []);
      const existingItem = storedFavouriteCart?.find(
        (item) => parseInt(item?.id) === parseInt(prod?.id)
      );

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
    } else {
      console.log("User is authenticated — handle API favourites instead");
    }
  };

  return (
    <ProductContext.Provider
      value={{
        HandleGetProducts,
        HandleAddTCart,
        productData,
        cartItems,
        cartCout,
        favoriteItem,
        favouriteCout,
        isAuthentified,
        setIsAuthentified,
        HandleUpdateCart,
        HandleDeleteCart,
        HandleAddFavouritrCart,
        loading,
        setLoading,
        setCartItems,
        setToken,
        token,
        User,
        setUser,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvide;
export { ProductContext };