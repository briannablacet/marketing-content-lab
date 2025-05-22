import React from "react";

const RegistrationModal = ({
  name,
  email,
  password,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onClose,
  error,
}: {
  name: string;
  email: string;
  password: string;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  error: string;
}) => {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        <form onSubmit={onSubmit} className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800 text-center">
            Register
          </h2>

          <div>
            <label htmlFor="registerName" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              id="registerName"
              type="text"
              value={name}
              onChange={onNameChange}
              placeholder="Enter your name"
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="registerEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="registerEmail"
              type="email"
              value={email}
              onChange={onEmailChange}
              placeholder="Enter your email"
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="registerPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="registerPassword"
              type="password"
              value={password}
              onChange={onPasswordChange}
              placeholder="Enter your password"
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationModal;
