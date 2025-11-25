import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useState, useEffect } from "react";
import DotLoader from "react-spinners/DotLoader";

import "react-toastify/dist/ReactToastify.css";

export const baseUrl = "http://localhost:5000/";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        pauseOnHover
        theme="colored"
      />

      {loading ? (
        <div className="flex flex-col items-center justify-center h-screen gap-6 bg-white animate-opacityFade">
          
          <DotLoader size={50} />

          <p className="text-3xl font-semibold tracking-widest text-gray-900">
            GRANDEUR
          </p>
        </div>
      ) : (
        <Outlet />
      )}
    </>
  );
}

export default App;
