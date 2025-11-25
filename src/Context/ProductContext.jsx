import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
const ProductContext = createContext();

const ProductProvide = ({ children }) => {
  const [productData, setProductData] = useState(null);
  const [isAuthentified, setIsAuthentified] = useState(false);
  const [cartCout, setCartCount] = useState(0);
  const [favouriteCout, setfavouriteCout] = useState(0);
  const [loading, setLoading] = useState(false);

  const [cartItems, setCartItems] = useState(
    JSON.parse(localStorage.getItem("cartItems")) || []
  );

  const [favoriteItem, setfavoriteItem] = useState(
    JSON.parse(localStorage.getItem("favourieCart")) || []
  );

  useEffect(() => {
    console.log("cart:", cartItems);
    if (cartItems) {
      const count = cartItems.reduce((acc, curr) => acc + curr?.quantity, 0);
      console.log('counttt', count);
      

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

  const HandleGetProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/getAllProduct", {
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

  const HandleAddTCart = async (prod, quantity = null, size = null, color = null) => {
    if (!isAuthentified) {
      // Get existing cart or initializez
      let storedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

      // Find if product already exists in the cart
      const existingItem = storedCartItems.find(
        (item) => parseInt(item.id) === parseInt(prod.id)
      );

      let updatedCartItems;
      if (existingItem) {
        // Create a new array with updated quantity for the existing item
        updatedCartItems = storedCartItems.map((item) =>
          parseInt(item.id) === parseInt(prod.id)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        toast.info("Existing item quantity added to cart Succesfully!");
      } else {
        // Add a new product entry if it doesn’t exist
        updatedCartItems = [
          ...storedCartItems,
          { ...prod, quantity, size, color },
        ];
        toast.success("Item Added to cart Succesfully!");
      }

      // Save updated cart in localStorage
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
      setCartItems(updatedCartItems);
      console.log("Updated Cart:", updatedCartItems);
    } else {
      console.log("User is authenticated — handle API cart instead");


    }

    
  };

  const HandleUpdateCart = async (prod) => {
    console.log("prod:", prod);

    try {
      if (!isAuthentified) {
        const storedCartItems =
          JSON.parse(localStorage.getItem("cartItems")) || [];

        const existingItem = storedCartItems.find(
          (item) => parseInt(item?.id) === parseInt(prod?.id)
        );

        if (!existingItem) {
          toast.error("Item does not exist in cart!");
          return;
        }

        // Replace quantity, size, and color instead of adding quantities
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
        console.log("User is authenticated — handle API update instead");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const HandleDeleteCart = (id) => {
    const storedCartItems = JSON.parse(localStorage.getItem("cartItems"));
    const updatedCartItems = storedCartItems?.filter(
      (item) => parseInt(item.id) !== parseInt(id)
    );

    console.log("updatedCartItems", updatedCartItems);

    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    setCartItems(updatedCartItems);
  };

  const HandleAddFavouritrCart = (prod) => {
    console.log("prod", prod);

    if (!isAuthentified) {
      // Get existing cart or initialize
      let storedFavouriteCart =
        JSON.parse(localStorage.getItem("favourieCart")) || [];

      // Find if product already exists in the cart
      const existingItem = storedFavouriteCart?.find(
        (item) => parseInt(item?.id) === parseInt(prod?.id)
      );

      let updatedFavouriteCart;
      if (existingItem) {
        toast.info("Item already in FavouriteCart");
        updatedFavouriteCart = storedFavouriteCart; // no change
      } else { 
        console.log("exist", existingItem);

        // Create a new array with updated quantity for the existing item
        updatedFavouriteCart = [
          ...storedFavouriteCart,
          { ...prod, quantity: 1 },
        ];
        toast.success("Item Added to FavouriteCart Succesfully!");
      }

      // Save updated cart in localStorage
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
   
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvide;
export { ProductContext };