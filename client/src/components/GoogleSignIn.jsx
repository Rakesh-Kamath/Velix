import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function GoogleSignIn({ text = "Sign in with Google" }) {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const buttonRef = useRef(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    
    if (!clientId) {
      setError("Google Client ID is not configured. Please check your .env file.");
      console.error("VITE_GOOGLE_CLIENT_ID is not set in environment variables");
      return;
    }

    // Check if script is already loaded
    if (window.google) {
      initializeGoogleSignIn(clientId);
      return;
    }

    // Load Google Identity Services script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => initializeGoogleSignIn(clientId);
    script.onerror = () => {
      setError("Failed to load Google Sign-In script");
      console.error("Failed to load Google Identity Services");
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup
      const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (existingScript && existingScript.parentNode) {
        existingScript.parentNode.removeChild(existingScript);
      }
    };
  }, []);

  const initializeGoogleSignIn = (clientId) => {
    if (!clientId) {
      setError("Google Client ID is missing");
      return;
    }

    if (window.google && buttonRef.current) {
      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredentialResponse,
        });

        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: "outline",
          size: "large",
          text: "signin_with",
          width: "100%",
        });
      } catch (err) {
        console.error("Error initializing Google Sign-In:", err);
        setError("Failed to initialize Google Sign-In");
      }
    } else {
      // Retry after a short delay if Google API isn't ready
      setTimeout(() => {
        if (window.google && buttonRef.current) {
          initializeGoogleSignIn(clientId);
        }
      }, 100);
    }
  };

  const handleCredentialResponse = async (response) => {
    try {
      await loginWithGoogle(response.credential);
      navigate("/");
    } catch (error) {
      console.error("Google sign-in error:", error);
      // Surface server error message when available for easier debugging
      const serverMessage = error?.response?.data?.message || error?.message;
      alert(`Google sign-in failed: ${serverMessage}`);
    }
  };

  if (error) {
    return (
      <div className="w-full p-4 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">{error}</p>
        <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
          Please add VITE_GOOGLE_CLIENT_ID to your .env file
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div ref={buttonRef} className="w-full"></div>
    </div>
  );
}

