import React from "react";
import { Routes, Route } from "react-router-dom";
// import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NavBar from "./components/NavBar";
import Register from "./pages/Register";
import Transfer from "./pages/Transfer";
import Login from "./pages/Login";
import Pricing from "./pages/Pricing";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer";
import UserContextProvider from "./context/Context";
import Dashboard from "./pages/Dashboard";
import Account from "./pages/Account";
import PaymentVerify from "./pages/PaymentVerify";
import PaymentFailed from "./pages/PaymentFailed";
import Documentation from "./pages/Docs";
import AdminUsers from "./pages/AdminUsers";
import AdminLogs from "./pages/AdminLogs";
import ErrorPage from "./components/ErrorPage";

const App = () => {
  return (
    <UserContextProvider>
      <NavBar />
      <Toaster
        toastOptions={{
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        }}
      />
      <div className="bg-background text-textPrimary min-h-[95vh] py-8 sm:px-18 px-4 mt-16 ">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transfer" element={<Transfer />} />
          <Route path="/account" element={<Account />} />
          <Route path="/docs" element={<Documentation />} />
          <Route path="/paymentChecker" element={<PaymentVerify />} />
          <Route path="/paymentFailed" element={<PaymentFailed />} />
          <Route path="/admin/getAllUsers" element={<AdminUsers />} />
          <Route path="/admin/logs" element={<AdminLogs />} />
          <Route path="/*" element={<ErrorPage status={"404"} message={"Page not Found"} />} />
        </Routes>
      </div>
      <Footer />
    </UserContextProvider>
  );
};

export default App;