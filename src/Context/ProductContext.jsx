import { createContext, useEffect, useState } from "react";
const ProductContext = createContext();
import { ToastContainer, toast } from "react-toastify";

const ProductProvider = ({ children }) => {
  const [productData, setProductData] = useState(null);
  const [isAuthentified, setisAuthentified] = useState(false);
  const [cartcout, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState(
    JSON.parse(localStorage.getItem("cartItems")) || []
  );

  useEffect(() => {
    console.log("cart:", cartItems);
    if (cartItems) {
      const count = cartItems?.reduce((acc, curr) => acc + curr?.quantity, 0);
      setCartCount(count);
    }
  }, [cartItems]);

  const HandleAddTCart = (prod, quantity = null, size = null, color = null) => {
    if (!isAuthentified) {
      let storedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

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

        toast.info("Existing Item quantity added to cart successfully");
      } else {
        updatedCartItems = [
          ...storedCartItems,
          { ...prod, quantity, size, color },
        ];
        toast.success("Item added to cart successfully");
      }

      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
      setCartItems(updatedCartItems);
      console.log("Updated Cart:", updatedCartItems);
    } else {
      console.log("User is authenticated - handle API cart instead");
    }
  };

  const HandleGetProducts = async () => {
    try {
      const res = await fetch("http://localhost:8000/products", {
        method: "GET",
      });

      const data = await res.json();

      if (res.ok) {
        console.log(data);
        setProductData(data);
      } else {
        console.log("Unable to fetch data");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const HandleUpdateCart = async (prod) => {
    try {
      if (!isAuthentified) {
        const storedCartItems = JSON.parse(localStorage.getItem("cartItems"));

        const existingProduct = storedCartItems.find(
          (item) => parseInt(item?.id) === parseInt(prod?.id)
        );

        if (!existingProduct) {
          toast.error("Product does not exist in cart!");
          return;
        }

        const updatedCartItems = storedCartItems.map((item) =>
          parseInt(item?.id) === parseInt(prod?.id)
            ? {
                ...item,
                size: prod?.size ?? item?.size,
                quantity: prod?.quantity ?? item?.quantity,
                color: prod?.color ?? item?.color,
              }
            : item
        );

        localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
        setCartItems(updatedCartItems);
        toast.success("Cart item updated successfully");
      } else {
        console.log("Authentified user");
      }
    } catch (error) {
      console.log(error?.message);
    }
  };

  const HandleDeleteCart = async (prodId) => {
    try {
      if (!isAuthentified) {
        const storedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

        const existingProduct = storedCartItems?.find(
          (item) => parseInt(item?.id) === parseInt(prodId)
        );

        if (!existingProduct) {
          toast.error("Product not found in cart!");
          return;
        }

        const updatedCartItems = storedCartItems.filter(
          (item) => parseInt(item?.id) !== parseInt(prodId)
        );

        localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
        setCartItems(updatedCartItems);
        toast.success("Item removed from cart successfully");
      } else {
        console.log("Authenticated user - handle API cart delete here");
      }
    } catch (error) {
      console.log(error?.message);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        HandleGetProducts,
        HandleAddTCart,
        HandleUpdateCart,
        HandleDeleteCart, 
        productData,
        cartItems,
        cartcout,
        setisAuthentified,
      }}
    >
      {children}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar pauseOnHover theme="colored" />
    </ProductContext.Provider>
  );
};

export default ProductProvider;
export { ProductContext };