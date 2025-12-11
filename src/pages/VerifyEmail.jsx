import { useNavigate, useParams} from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import { FaCheckCircle, FaTimesCircle, FaEnvelope } from "react-icons/fa";
import Layout from "../Shared/Layout/Layout";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useState } from "react";

const VerifyEmail = () => {
const {token} = useParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    verifyEmail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const verifyEmail = async () => {
    try {
      if (!token) {
        setVerificationStatus("error");
        setMessage("Invalid verification link. No token provided.");
        return;
      }

      // Call your backend API to verify the token
      const response = await fetch(`http://localhost:5000/verifyemail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: token ,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setVerificationStatus("success");
        setMessage(data.message || "Email verified successfully!");
        toast.success("Email verified! You can now login.");

        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setVerificationStatus("error");
        setMessage(data.message || "Verification failed. Please try again.");
        toast.error(data.message || "Verification failed");
      }
    } catch (error) {
      setVerificationStatus("error");
      setMessage("Something went wrong. Please try again later.");
      toast.error("Verification failed");
      console.error("Verification error:", error);
    }
  };

  return (
    <Layout>
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8">
          <div className="flex flex-col items-center gap-6">
            {/* Loading State */}
            {verificationStatus === "loading" && (
              <>
                <div className="bg-gray-100 p-6 rounded-full">
                  <FaEnvelope size={48} className="text-gray-600" />
                </div>
                <h2 className="text-2xl font-bold text-center">
                  Verifying Your Email
                </h2>
                <p className="text-center text-gray-600">
                  Please wait while we verify your email address...
                </p>
                <PulseLoader size={12} color="#000" />
              </>
            )}

            {/* Success State */}
            {verificationStatus === "success" && (
              <>
                <div className="bg-green-100 p-6 rounded-full animate-bounce">
                  <FaCheckCircle size={48} className="text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-center text-green-600">
                  Email Verified!
                </h2>
                <p className="text-center text-gray-600">{message}</p>
                <p className="text-sm text-center text-gray-500">
                  Redirecting to login page...
                </p>
                <button
                  onClick={() => navigate("/login")}
                  className="bg-black text-white py-3 px-8 rounded-lg font-semibold hover:bg-gray-800 transition-all w-full"
                >
                  Go to Login
                </button>
              </>
            )}

            {/* Error State */}
            {verificationStatus === "error" && (
              <>
                <div className="bg-red-100 p-6 rounded-full">
                  <FaTimesCircle size={48} className="text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-center text-red-600">
                  Verification Failed
                </h2>
                <p className="text-center text-gray-600">{message}</p>
                <div className="flex flex-col gap-3 w-full">
                  <button
                    onClick={() => navigate("/login")}
                    className="bg-black text-white py-3 px-8 rounded-lg font-semibold hover:bg-gray-800 transition-all"
                  >
                    Back to Login
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VerifyEmail;
