import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/Context";

const Transfer = () => {
  const [sending, setSending] = useState(false);
  const navigate = useNavigate();
  const destAccount = useRef(null);
  const amount = useRef(null);
  const { isLoggedIn, login, setCurrentPage, user } = useContext(UserContext);
  const apiKey = user.apiKey
  useEffect(() => {
    setCurrentPage("transfer");
  }, [setCurrentPage]);
  console.log(isLoggedIn);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      accountNumber: destAccount.current.value,
        amount: +amount.current.value,
        sender: user.accountNumber
    };
    console.log(data);
    if (data.accountNumber === "" || data.amount === "") {
      toast.error("Please fill the fields");
    } else if(!apiKey || apiKey === ""){
        toast.error("Please generate API KEY first.")
    } else{
      setSending(true);
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/fintech/transfer`,
          data, {
            headers: {
                'x-api-key': apiKey,
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
          }
        );
        if (response.status === 200) {
          toast.success(`${data.amount} transferred to ${data.accountNumber}`);
          navigate("/dashboard");
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
      setSending(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-background text-textPrimary mt-4">
      {isLoggedIn ? (
        <div className="bg-surface rounded-lg shadow-glow-accent p-8 md:min-w-108 flex flex-col">
          <div className="flex flex-col justify-center items-center w-full text-accent">
            <h1 className="font-bold text-3xl text-center">TRANSFER FUNDS</h1>
          </div>
          <div>
            <form
              onSubmit={(e) => handleSubmit(e)}
              className="grid grid-cols-1 w-full gap-4 mt-4"
            >
              <div className="flex flex-col">
                <label htmlFor="accountNo" className="text-sm text-textPrimary">
                  Receiver Account Number: 
                </label>
                <input
                  ref={destAccount}
                  type="text"
                  id="accountNo"
                  placeholder="Enter Destination Account Number"
                  className="border border-accent rounded-lg p-2 mt-1 bg-surface text-textPrimary"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="amount" className="text-sm text-textPrimary">
                  Amount
                </label>
                <input
                  ref={amount}
                  type="number"
                  id="amount"
                  placeholder="Enter Amount"
                  className="border border-accent rounded-lg p-2 mt-1 bg-surface text-textPrimary"
                />
              </div>
              <div className="">
                <button
                  disabled={sending}
                  type="submit"
                  className="hover:bg-accentHover hover:cursor-pointer bg-accent text-white rounded-lg p-2 mt-2 w-full transition-all duration-200"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div>
          <h1 className="text-3xl text-accent">
            You are not Logged in. Please log in to transfer funds.
          </h1>
          <p className="text-textPrimary text-lg mt-4">
            You can go to the{" "}
            <a href="/" className="text-accent hover:underline">
              Home Page
            </a>{" "}
            or{" "}
            <a href="/login" className="text-accent hover:underline">
              Login Page
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default Transfer;
