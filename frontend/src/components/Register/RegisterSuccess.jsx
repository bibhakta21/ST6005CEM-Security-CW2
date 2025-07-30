import { Link } from "react-router-dom";

export default function RegisterSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-10 rounded-xl shadow-md text-center max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-green-600">🎉 Registration Complete!</h1>
        <p className="mb-6 text-gray-700">
          Your email has been verified. You can now login to your account using MFA.
        </p>
        <Link
          to="/login"
          className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-900 transition"
        >
          Continue to Login
        </Link>
      </div>
    </div>
  );
}
