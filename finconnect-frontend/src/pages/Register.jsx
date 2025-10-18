import React, { useEffect, useRef } from "react";
import axios from "axios";  
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useContext } from "react";
import { UserContext } from "../context/Context";

const Register = () => {
  const navigate = useNavigate();
  const { isLoggedIn, setCurrentPage } = useContext(UserContext);
  useEffect(() => {
    setCurrentPage("register");
  }, [setCurrentPage]);
  const firstName = useRef(null);
  const lastName = useRef(null);
  const email = useRef(null);
  const password = useRef(null);
  const confirmPassword = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name: firstName.current.value + " " + lastName.current.value,
      email: email.current.value,
      password: password.current.value,
      confirmPassword: confirmPassword.current.value,
    };
    if (
      data.name === "" ||
      data.email === "" ||
      data.password === "" ||
      data.confirmPassword === ""
    ) {
      toast.error("Please fill all the fields");
    } else if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try{
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/auth/register`,
          {name: data.name, email: data.email, password: data.password},{
            withCredentials: true,
          }
        );
        if(response.status === 201) {
          toast.success("Registration successful");
          navigate("/login");
        }

      }catch(err){
        toast.error(err.response.data.message);
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-background text-textPrimary mt-4">
      {!isLoggedIn ? (
        <div className="bg-surface rounded-lg shadow-glow-accent p-8 min-w-108 flex flex-col">
          <div className="flex flex-col justify-center items-center w-full text-accent">
            <h1 className="font-bold text-3xl text-center">REGISTER</h1>
          </div>
          <div>
            <form
              onSubmit={(e) => handleSubmit(e)}
              className="grid md:grid-cols-2 grid-cols-1 w-full gap-4 mt-4"
            >
              <div className="flex flex-col">
                <label htmlFor="firstName" className="text-sm text-textPrimary">
                  First Name
                </label>
                <input
                  ref={firstName}
                  type="text"
                  id="firstName"
                  placeholder="Enter your First Name"
                  className="border border-accent rounded-lg p-2 mt-1 bg-surface text-textPrimary"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="lastName" className="text-sm text-textPrimary">
                  Last Name
                </label>
                <input
                  ref={lastName}
                  type="text"
                  id="lastName"
                  placeholder="Enter your Last Name"
                  className="border border-accent rounded-lg p-2 mt-1 bg-surface text-textPrimary"
                />
              </div>
              <div className="flex flex-col  md:col-span-2">
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
              <div className="flex flex-col  md:col-span-2">
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
              <div className="flex flex-col  md:col-span-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm text-textPrimary"
                >
                  Confirm Password
                </label>
                <input
                  ref={confirmPassword}
                  type="password"
                  id="confirmPassword"
                  placeholder="Retype Password"
                  className="border border-accent rounded-lg p-2 mt-1 bg-surface text-textPrimary"
                />
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="hover:bg-accentHover hover:cursor-pointer bg-accent text-white rounded-lg p-2 mt-2 w-full transition-all duration-200"
                >
                  Sign Up
                </button>
              </div>
              <div className="md:col-span-2 flex flex-col items-center">
                <p className="text-sm text-textPrimary text-center">
                  Already have an account?{" "}
                  <a href="/login" className="text-accent hover:underline">
                    Login
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div>
          <h1 className="text-3xl text-accent">
            You are already Logged in. Please log out to register new user
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

export default Register;
