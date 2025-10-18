import React, { useEffect, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/Context";

const Login = () => {
  const navigate = useNavigate();
  const email = useRef(null);
  const password = useRef(null);
  const { isLoggedIn, login, setCurrentPage } = useContext(UserContext);
  useEffect(() => {
    setCurrentPage("login");
  }, [setCurrentPage]);
  console.log(isLoggedIn);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      email: email.current.value,
      password: password.current.value,
    };
    console.log(data);
    if (data.email === "" || data.password === "") {
      toast.error("Please fill the fields");
    } else {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/auth/login`,
          data,
          {
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          toast.success("Login successful");
          console.log(response.data);
          login(response.data.user);
          localStorage.setItem("token", response.data.token);
          navigate("/pricing");
        }
      } catch (error) {
        toast.error(error?.response?.data?.message);
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-background text-textPrimary ">
      {!isLoggedIn ? (
        <div className="bg-surface rounded-lg shadow-glow-accent p-8 sm:min-w-108 min-w-48 flex flex-col">
          <div className="flex flex-col justify-center items-center w-full text-accent">
            <h1 className="font-bold text-3xl text-center">SIGN IN</h1>
          </div>
          <div>
            <form
              onSubmit={(e) => handleSubmit(e)}
              className="grid grid-cols-1 w-full gap-4 mt-4"
            >
              <div className="flex flex-col">
                <label htmlFor="email" className="text-sm text-textPrimary">
                  Email
                </label>
                <input
                  ref={email}
                  type="email"
                  id="email"
                  placeholder="Enter your Email"
                  className="border border-accent rounded-lg p-2 mt-1 bg-surface text-textPrimary"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="password" className="text-sm text-textPrimary">
                  Password
                </label>
                <input
                  ref={password}
                  type="password"
                  id="password"
                  placeholder="Enter your Password"
                  className="border border-accent rounded-lg p-2 mt-1 bg-surface text-textPrimary"
                />
              </div>
              <div className="">
                <button
                  type="submit"
                  className="hover:bg-accentHover hover:cursor-pointer bg-accent text-white rounded-lg p-2 mt-2 w-full transition-all duration-200"
                >
                  Log In
                </button>
              </div>
              <div className=" flex flex-col items-center">
                <p className="text-sm text-textPrimary text-center">
                  Don't have an account?{" "}
                  <a href="/register" className="text-accent hover:underline">
                    Register
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div>
          <h1 className="text-3xl text-accent">
            You are already Logged in. Please log out to log in again
          </h1>
          <p className="text-textPrimary text-lg mt-4">
            You can go to the{" "}
            <a href="/" className="text-accent hover:underline">
              Home Page
            </a>{" "}
            or{" "}
            <a href="/pricing" className="text-accent hover:underline">
              Pricing Page
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default Login;
