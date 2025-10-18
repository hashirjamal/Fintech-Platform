import React from "react";
import { MdCancel, MdSmsFailed } from "react-icons/md";

function PaymentCancelled() {
  return (
    <div className="flex flex-col justify-center items-center min-h-[95vh] bg-background text-textPrimary mt-4 p-4">
      <div className="bg-surface rounded-lg shadow-glow-accent w-full min-h-[60vh] flex flex-col md:flex-row p-8 md:justify-between transition-all duration-300 hover:scale-105">
        <div className="flex flex-col justify-center items-center w-full text-accent md:w-[60%] md:px-6 px-4">
          <div className="w-full flex flex-col justify-center items-center mb-6">
            <h1 className="font-extrabold md:text-6xl text-4xl text-white text-center transition-all duration-500 hover:text-accent">
              Payment Cancelled
            </h1>
          </div>

          <div className="mt-4 text-center">
            <h2 className="text-2xl font-semibold text-textPrimary">
              It looks like you have cancelled the payment.
            </h2>
            <p className="text-lg font-medium mt-2 text-textSecondary">
              If this was a mistake, you can try again by proceeding with the payment.
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center w-full md:w-[40%] mt-4 md:mt-0">
          {/* <img src="/payment-cancelled.png" className="md:w-108 w-48" alt="Cancelled" /> */}
          <MdSmsFailed className="md:w-108 w-48" />
        </div>
      </div>
      <div className="md:my-10 my-6 w-full flex justify-center items-center">
        <a
          href="/pricing"
          className="py-2 px-6 bg-accent text-white rounded-lg transition-all duration-300 hover:bg-accentHover hover:scale-105"
        >
          Return to Pricing
        </a>
      </div>
    </div>
  );
}

export default PaymentCancelled;
