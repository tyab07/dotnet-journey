import { useNavigate } from "react-router-dom";

function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-10 max-w-sm w-full text-center">
        {/* Icon */}
        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-7 h-7 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
            />
          </svg>
        </div>

        <h1 className="text-xl font-bold text-gray-800 mb-2">Access Denied</h1>
        <p className="text-sm text-gray-500 mb-6">
          You don't have permission to view this page.
          Contact your administrator if you believe this is a mistake.
        </p>

        <button
          onClick={() => navigate("/")}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}

export default Unauthorized;
