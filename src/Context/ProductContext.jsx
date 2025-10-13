import { createContext, useEffect, useState } from "react";
const ProductContext = createContext();

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
      } else {
        updatedCartItems = [
          ...storedCartItems,
          { ...prod, quantity, size, color },
        ];
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

  return (
    <ProductContext.Provider
      value={{
        HandleGetProducts,
        HandleAddTCart,
        productData,
        cartItems,
        cartcout,
        setisAuthentified,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;
export { ProductContext };
