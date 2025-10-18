import axios from "axios";
import React, { useContext } from "react";
import { UserContext } from "../context/Context";

const Modal = ({ setOpen, text, title, link, action, apiKey, buttonText }) => {

const {setUserInLocalStorage} = useContext(UserContext)
console.log(action)
  const handleDelete = async () => {
    setOpen(false);
    try {
      // Replace with the correct subscription ID and userId
      let user = JSON.parse(localStorage.getItem("user"));
      const userId = user.accountNumber;
      const subscriptionId = user.Subscription.subscriptionId;

      const response = await axios.delete(
        `http://localhost:8000/api/pay/deleteSubscription?subscriptionId=${subscriptionId}&userId=${userId}`
      );

      console.log(response);
      // Handle the response
      if (response.status === 200) {
        // Successful cancellation
        alert("Subscription canceled successfully.");
        let user = JSON.parse(localStorage.getItem("user"))
        if(user.accountNumber != response.data.session.metadata.userId) return
          user.isSubscribed = false
          user.subscriptionId = null
          setUserInLocalStorage(user)
          localStorage.setItem("user",JSON.stringify(user))
      } else {
        // Something went wrong
        alert("Failed to cancel subscription.");
      }
    } catch (error) {
      // Handle the error
      console.error("Error while deleting subscription:", error);
      alert(
        "There was an error processing the cancellation. Please try again later."
      );
    }
  };

  return (
    <div
      className="relative z-10"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fixed inset-0 bg-gray-500/75 transition-opacity"
        aria-hidden="true"
      ></div>

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg  text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-surface px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3
                    className="text-textPrimary text-xl font-semibold "
                    id="modal-title"
                  >
                    {title}
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-textSecondary">
                      {text}
                      <br />
                      {apiKey && (
                        <span className="text-accent font-semibold text-lg">
                          {apiKey}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-surface px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              {!apiKey && (
                <button
                  type="button"
                  onClick={() => (action ? action() : handleDelete())}
                  className="inline-flex w-full justify-center rounded-md bg-accent px-3 py-2 text-sm font-semibold text-textPrimary shadow-xs hover:bg-accentHover hover:cursor-pointer sm:ml-3 sm:w-auto"
                >
                  {buttonText}
                </button>
              )}
              <button
                type="button"
                className="mt-3 hover:cursor-pointer inline-flex w-full justify-center rounded-md bg-gray-300 px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
