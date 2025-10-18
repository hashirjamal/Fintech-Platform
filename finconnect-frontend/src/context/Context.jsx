import { createContext, React, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext({
  token: "",
  logout: () => {},
  login: () => {},
  userId: "",
  currentPage: "home",
});

const UserContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const getUser = ()=>{
    const user = localStorage.getItem("user");
    if (user) {
      return JSON.parse(user);
    } else {
      return null;
    }
  }
  const [user, setUser] = useState(getUser());
  const [isLoggedIn, setIsLoggedIn] = useState(user ? true : false);
  const [isSubscribed, setIsSubscribed] = useState(user && user.isSubscribed==true ? true : false);
  const [isAdmin, setIsAdmin] = useState(user ? user.role=="admin" : false);
  const [currentPage, setCurrentPage] = useState("home");


  const setUserinLocalStorage = (user) => {
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
  }


  const login = (user) => {
    setUser(user);
    setIsLoggedIn(true);
    setIsSubscribed(user.isSubscribed);
    setIsAdmin(user.role=="admin");
    localStorage.setItem("user", JSON.stringify(user));
  };
  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setIsSubscribed(false);
    setIsAdmin(false);
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUserinLocalStorage,
        isLoggedIn,
        currentPage,
        setCurrentPage,
        login,
        logout,
        isSubscribed,
        isAdmin,
        setIsSubscribed,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
