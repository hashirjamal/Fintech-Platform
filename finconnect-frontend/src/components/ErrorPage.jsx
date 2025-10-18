import React from 'react'

const ErrorPage = ({status, message}) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background text-textPrimary">
      <h1 className="text-6xl font-bold mb-4">{status}</h1>
      <p className="text-2xl mb-4">Page Not Found</p>
      <p className="text-lg text-textSecondary">{message}</p>
      <a href="/" className="mt-6 bg-accent hover:bg-accentHover text-white py-2 px-4 rounded-lg transition duration-200">Go to Home</a>
    </div>
  )
}

export default ErrorPage