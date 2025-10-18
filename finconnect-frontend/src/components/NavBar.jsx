"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useContext } from "react";
import { UserContext } from "../context/Context";
import { href } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };
  const { isLoggedIn, logout, currentPage, isSubscribed } =
    useContext(UserContext);
  console.log(isSubscribed)
  const handleLogout = () => {
    if (isLoggedIn) {
      logout();
    } else {
      toast.error("You are not logged in");
    }
  };
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 90);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <nav
      className={` border-gray-200  fixed top-0 z-50 w-full
      ${
        isScrolled
          ? "bg-white/50 dark:bg-[#0a0a0a]/40 backdrop-blur-sm"
          : "bg-white dark:bg-[#0a0a0a]"
      }
    `}
    >
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a className="flex items-center space-x-3 rtl:space-x-reverse">
          <span className="self-center flex items-center text-2xl font-semibold whitespace-nowrap dark:text-white ">
            <img src="/logo.png" className="w-12 h-12 mr-4" alt="FC logo" />
            <span className="text-[#00ADB5] font-semibold text-4xl">F</span>in
            <span className="text-[#00ADB5] font-semibold text-4xl">C</span>
            onnect
          </span>
        </a>
        <button
          data-collapse-toggle="navbar-default"
          onClick={toggleNavbar}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-default"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div
          className={`${isOpen ? "" : "hidden"} w-full md:block md:w-auto`}
          id="navbar-default"
        >
          <ul
            className={`font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white ${
              isScrolled ? "dark:bg-transparent" : "dark:bg-[#0a0a0a]"
            } dark:border-gray-700`}
          >
            {[
              { href: "/", label: "Home", page: "home" },
              {
                href: "/pricing",
                label: "Pricing",
                page: "pricing",
                auth: true,
              },
              { href: "/docs", label: "Docs", page: "docs", auth: true },
              { href: "/login", label: "Login", page: "login", guest: true },
              {
                href: "/register",
                label: "Register",
                page: "register",
                guest: true,
              },
              {
                href: "/dashboard",
                label: "Dashboard",
                page: "dashboard",
                auth: true,
              },
              {
                href: "/transfer",
                label: "Transfer",
                page: "transfer",
                auth: true,
              },
              {
                href: "/account",
                label: "Account",
                page: "account",
                subscribed: true,
              },
            ]
              .filter((link) =>
                link.auth
                  ? isLoggedIn
                  : link.guest
                  ? !isLoggedIn
                  : link.subscribed
                  ? isSubscribed
                  : true
              )
              .map(({ href, label, page }) => (
                <li key={label}>
                  <a
                    href={href}
                    className={`block py-2 px-3 rounded-sm md:p-0 transition ${
                      currentPage === page
                        ? "bg-[#00ADB5] text-white md:text-[#00ADB5] md:bg-transparent font-semibold cursor-default"
                        : "text-gray-900 dark:text-white hover:text-[#00ADB5] dark:hover:text-[#00ADB5] hover:bg-gray-900/50 md:hover:bg-transparent "
                    }`}
                  >
                    {label}
                  </a>
                </li>
              ))}

            {isLoggedIn && (
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-gray-900 dark:text-white hover:text-[#00ADB5] dark:hover:text-[#00ADB5] hover:bg-gray-900/50 md:hover:bg-transparent block py-2 px-3 rounded-sm md:p-0 transition hover:cursor-pointer"
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
