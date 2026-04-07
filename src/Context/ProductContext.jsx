const ProductProvide = ({ children }) => {
  const [productData, setProductData] = useState(null);
  
  // 1. Safety check for isAuthentified
  const [isAuthentified, setIsAuthentified] = useState(
    localStorage.getItem("isAuthentified") === "true"
  );

  const [cartCout, setCartCount] = useState(0);
  const [favouriteCout, setfavouriteCout] = useState(0);
  const [loading, setLoading] = useState(false);

  const getLocalData = (item, fallback) => {
    try {
      const storedValue = localStorage.getItem(item);

      // Check if the value is null, undefined, or the string "undefined"
      if (!storedValue || storedValue === "undefined" || storedValue === "null") {
        return fallback;
      }

      return JSON.parse(storedValue);
    } catch (error) {
      console.error(`Error parsing localStorage key "${item}":`, error);
      return fallback;
    }
  };

  // ✅ FIX: Use arrow functions inside useState so getLocalData handles the safety check
  const [cartItems, setCartItems] = useState(() => getLocalData("cartItems", []));
  const [User, setUser] = useState(() => getLocalData("user", {}));
  const [favoriteItem, setfavoriteItem] = useState(() => getLocalData("favourieCart", []));
  
  // Token is just a string, so JSON.parse isn't needed here
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    console.log("UserContext:", User);
    if (User && User?.role) {
      setIsAuthentified(true);
    }
  }, [User]);

  useEffect(() => {
    if (cartItems && Array.isArray(cartItems)) {
      const count = cartItems.reduce((acc, curr) => {
        // Use the same safety logic here!
        const qty = curr?.quantity || 0;
        return acc + Number(qty);
      }, 0);
      setCartCount(count);
    }
  }, [cartItems]);

  useEffect(() => {
    console.log("favv:", favoriteItem);
    if (favoriteItem) {
      const count = favoriteItem.reduce((acc, curr) => acc + curr?.quantity, 0);
      setfavouriteCout(count);
    }
  }, [favoriteItem]);
// Add this inside ProductProvide in ProductContext.js
useEffect(() => {
  const fetchUserCart = async () => {
    // Only fetch if we are authenticated and have a token/userID
    if (isAuthentified && token && User?.userid) {
      try {
        const res = await fetch(`${baseUrl}getcart/${User.userid}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          const items = data?.data?.Productcart || [];
          setCartItems(items);
          localStorage.setItem("cartItems", JSON.stringify(items));
        }
      } catch (error) {
        console.error("Failed to fetch server cart:", error);
      }
    }
  };

  fetchUserCart();
}, [isAuthentified, token, User?.userid]); // Runs when login status or user changes

  const HandleGetProducts = async () => {
    try {
      const res = await fetch(`${baseUrl}getAllProduct`, {
        method: "GET",
      });

      const data = await res.json();

      if (res.ok) {
        console.log(data);
        setProductData(data?.data);
        localStorage.setItem("productData", JSON.stringify(data));
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

  const HandleAddTCart = async (
    prod,
    quantity = null,
    size = null,
    color = null
  ) => {
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
        toast.info("Existing item quantity added to cart Succesfully!");
      } else {
        updatedCartItems = [
          ...storedCartItems,
          { ...prod, quantity, size, color },
        ];
        toast.success("Item Added to cart Succesfully!");
      }

      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
      setCartItems(updatedCartItems);
      console.log("Updated Cart:", updatedCartItems);
    } else {
      try {
        console.log("User is authenticated — handle API cart instead");

        console.log("tok", token && token);
        console.log("uId", Number(User && User?.userid));

        const res = await fetch(`${baseUrl}addcart`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token && token}`,
          },
          body: JSON.stringify({
            userid: Number(User && User?.userid),
            productid: Number(prod?.id),
            color,
            size,
            quantity,
          }),
        });

        const data = await res.json();
        if (res.ok) {
          toast.success(data?.message);
          localStorage.setItem(
            "cartItems",
            JSON.stringify(data?.data?.Productcart)
          );
          setCartItems(data?.data?.Productcart);

        } else {
          toast.error(data?.message);
        }
        console.log("addCartRes:", data);
      } catch (error) {
        console.log("error", error.message);
        toast.success("unable to add to cart, please try again later!");
      }
    }
  };

  const HandleUpdateCart = async (prod) => {
    console.log("prodii:", prod);

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

        localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
        setCartItems(updatedCartItems);

        toast.success("Item Updated Successfully!");
        console.log("Updated Cart:", updatedCartItems);
      } else {
        console.log("Update....");

        console.log("tok", token && token);
        console.log("uId", Number(User && User?.userid));

        const res = await fetch(`${baseUrl}updatecart`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: ` Bearer ${token && token}`,
          },
          body: JSON.stringify({
            userid: Number(User && User?.userid),
            productid: Number(prod?.product?.id || prod?.productid),
            color: prod?.color,
            size: prod?.size,
            quantity: prod?.quantity,
          }),
        });

        const data = await res.json();
        if (res.ok) {
          toast.success(data?.message);
          localStorage.setItem(
            "cartItems",
            JSON.stringify(data?.data?.Productcart)
          );
          setCartItems(data?.data?.Productcart);
        } else {
          toast.error(data?.message);
        }
        console.log("addCartRes:", data);
      }
    } catch (error) {
      console.log(error.message);
      toast.error("unable to update cart, please try again later!");
    }
  };

  const HandleDeleteCart = async (id) => {
    try {
      if (!isAuthentified) {
        const storedCartItems = getLocalData("cartItems", []);
        const updatedCartItems = storedCartItems?.filter(
          (item) => parseInt(item.id) !== parseInt(id)
        );

        console.log("updatedCartItems", updatedCartItems);

        localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
        setCartItems(updatedCartItems);
        toast.success("Item removed from cart!");
      } else {
        console.log("tok", token && token);
        console.log("uId", Number(User && User?.userid));

        const res = await fetch(`${baseUrl}deletecart`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: ` Bearer ${token && token}`,
          },
          body: JSON.stringify({
            userid: Number(User && User?.userid),
            productid: Number(id),
          }),
        });

        const data = await res.json();
        if (res.ok) {
          toast.success(data?.message);
          localStorage.setItem(
            "cartItems",
            JSON.stringify(data?.data?.Productcart)
          );
          setCartItems(data?.data?.Productcart);
        } else {
          toast.error(data?.message);
        }
        console.log("addCartRes:", data);
      }
    } catch (error) {
      console.log("error", error.message);
      toast.error("unable to delete cart, please try again later!");
    }
  };

  const HandleAddFavouritrCart = (prod) => {
    console.log("prod", prod);

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
        console.log("exist", existingItem);
        updatedFavouriteCart = [
          ...storedFavouriteCart,
          { ...prod, quantity: 1 },
        ];
        toast.success("Item Added to FavouriteCart Succesfully!");
      }

      localStorage.setItem(
        "favourieCart",
        JSON.stringify(updatedFavouriteCart)
      );
      setfavoriteItem(updatedFavouriteCart);
      console.log("Updated favCart:", updatedFavouriteCart);
    } else {
      console.log("User is authenticated — handle API cart instead");
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
