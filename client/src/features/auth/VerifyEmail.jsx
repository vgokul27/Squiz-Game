import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader, Mail } from "lucide-react";
import api from "../../services/api";
import AuthLayout from "../../components/AuthLayout";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [message, setMessage] = useState("");

  useEffect(() => {
    verifyEmail();
  }, [token]);

  const verifyEmail = async () => {
    try {
      const response = await api.get(`/auth/verify-email/${token}`);

      if (response.data.success) {
        setStatus("success");
        setMessage(response.data.message);

        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (error) {
      setStatus("error");
      setMessage(error.response?.data?.message || "Verification failed");
    }
  };

  return (
    <AuthLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto text-center"
      >
        <div className="card-neon">
          {status === "verifying" && (
            <>
              <Loader className="w-16 h-16 text-primary-500 mx-auto mb-6 animate-spin" />
              <h1 className="text-3xl font-bold mb-4">Verifying Email...</h1>
              <p className="text-dark-500">
                Please wait while we verify your email address.
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
              >
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
              </motion.div>
              <h1 className="text-3xl font-bold mb-4 text-green-500">
                Email Verified!
              </h1>
              <p className="text-dark-500 mb-6">{message}</p>
              <p className="text-dark-500 text-sm">Redirecting to login...</p>
            </>
          )}

          {status === "error" && (
            <>
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
              <h1 className="text-3xl font-bold mb-4 text-red-500">
                Verification Failed
              </h1>
              <p className="text-dark-500 mb-6">{message}</p>
              <Link to="/login" className="btn-primary inline-block">
                Go to Login
              </Link>
            </>
          )}
        </div>
      </motion.div>
    </AuthLayout>
  );
};

export default VerifyEmail;
