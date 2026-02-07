import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebaseAuth";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      // 1️⃣ Open Google sign-in popup
      const result = await signInWithPopup(auth, googleProvider);

      // 2️⃣ Send Google user info to backend
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Google sign-in failed");

      // 3️⃣ Save user in Redux store
      dispatch(signInSuccess(data));

      // 4️⃣ Navigate to home page
      navigate("/");
    } catch (error) {
      console.error("Google sign-in error:", error);
      alert("Failed to sign in with Google. Please try again.");
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="bg-red-700 text-white p-3 rounded-lg hover:opacity-95 uppercase font-semibold"
    >
      Continue with Google
    </button>
  );
}
