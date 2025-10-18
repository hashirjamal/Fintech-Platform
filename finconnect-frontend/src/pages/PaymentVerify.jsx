import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { UserContext } from "../context/Context";

function PaymentVerify() {
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [error, setError] = useState(null);
  const { search } = useLocation();

  const {setUserInLocalStorage} = useContext(UserContext)

  useEffect(() => {
    const getSessionId = new URLSearchParams(search).get("session_id");

    if (getSessionId) {
      // Make API call to verify payment status
      axios
        .get(`http://localhost:8000/api/pay/verifyPaymentStatus?session_id=${getSessionId}`)
        .then((response) => {
          setPaymentStatus(response.data);
          let user = JSON.parse(localStorage.getItem("user"))
        if(user.accountNumber != response.data.session.metadata.userId) return
          user.isSubscribed = true
          user.subscriptionId = response.data.session.metadata.subscriptionId
          setUserInLocalStorage(user)
          localStorage.setItem("user",JSON.stringify(user))
        })
        .catch((err) => {
          setError("Unable to verify payment status. Please try again.");
        });
    }
  }, [search]);

  return (
    <div className="flex flex-col justify-center items-center min-h-[95vh] bg-background text-textPrimary mt-4">
      <div className="bg-surface rounded-lg shadow-glow-accent w-full min-h-[60vh] flex flex-col md:flex-row p-4 md:justify-between">
        <div className="flex flex-col justify-center items-center w-full text-accent md:w-[60%] md:px-6 px-2">
          <div className="w-full flex flex-col justify-center items-center">
            <h1 className="font-bold md:text-6xl text-4xl text-white text-center">
              Payment Status
            </h1>
          </div>
          {paymentStatus ? (
            <div className="mt-4 text-center">
              <h2 className="text-2xl font-semibold text-textPrimary">
                Payment {paymentStatus.success ? "Successful" : "Failed"}
              </h2>
              <p className="text-lg font-medium mt-2">
                Amount: ${paymentStatus.session.amount_total/100 }
              </p>
              <p className="text-md mt-2 text-textSecondary">
                Transaction ID: {paymentStatus.session.id}
              </p>
            </div>
          ) : error ? (
            <div className="mt-4 text-center text-red-600">
              <h2 className="text-2xl font-semibold">Error</h2>
              <p className="text-lg">{error}</p>
            </div>
          ) : (
            <div className="mt-4 text-center text-textSecondary">
              <h2 className="text-xl font-semibold">Verifying your payment...</h2>
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center items-center w-full md:w-[40%] mt-4 md:mt-0">
          <img src="/line-chart.png" className="md:w-108 w-48" alt="image" />
        </div>
      </div>
      <div className="md:my-10 my-6 w-full flex justify-center items-center">
        <a href="/dashboard" className="text-lg text-accent hover:text-accentHover transition-all">
          Return to Dashboard
        </a>
      </div>
    </div>
  );
}

export default PaymentVerify;
