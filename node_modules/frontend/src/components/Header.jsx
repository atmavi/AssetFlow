import React from "react";

function Header(user, logout) {
  return (
    <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">AssetFlow Dashboard</h1>
            <p className="text-sm text-gray-600">Welcome, {user?.name || "User"}</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            Logout
          </button>
        </div>
      </header>
  );
}

export default Header;