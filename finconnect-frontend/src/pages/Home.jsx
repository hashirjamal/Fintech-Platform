import React, { useEffect } from "react";
import { useContext } from "react";
import { UserContext } from "../context/Context";

function Home() {
  const { setCurrentPage } = useContext(UserContext);
  useEffect(() => {
      setCurrentPage("home");
    }, [setCurrentPage]);
  const offers = [{
    title: "Dashboard",
    description: "Get a comprehensive overview of your financial data with our intuitive dashboard. Monitor your transactions, account balances, and spending patterns at a glance.",
    icon: "/dashboard.png",
  },{
    title: "Transaction Logs",
    description: "Keep track of all your transactions with our detailed logs. Filter, search, and analyze your transaction history to gain insights into your spending habits.",
    icon: "/transaction.png",
  },{
    title: "Invoice Generation",
    description: "Create professional invoices in seconds and send invoices directly to your clients.",
    icon: "/invoice.png",
  }]
  return (
    <div className="flex flex-col justify-center items-center min-h-[95vh] bg-background text-textPrimary mt-4">
      <div className="bg-surface rounded-lg shadow-glow-accent  w-full  min-h-[60vh] flex flex-col md:flex-row p-4 md:justify-between">
        <div className="flex flex-col justify-center items-center  w-full text-accent md:w-[60%] md:px-6 px-2">
          <div className="w-full flex flex-col justify-center items-center">
            <img src="logo.png" className="w-36 h-36 mb-4" alt="" />
            <h1 className="font-bold md:text-6xl text-4xl text-white text-center">
              Welcome to <span className="text-accent">F</span>in
              <span className="text-accent">C</span>onnect
            </h1>
          </div>
          <p className="md:text-2xl text-lg text- mt-4 font-semibold text-center">
            Build, test, and manage financial applications with secure,
            subscription-controlled mock APIs.
          </p>
          <div className="flex flex-col w-full justify-center items-center mt-4">
            <h1 className="md:text-xl font-semibold text-lg text-textPrimary text-center">
              Ready to get started?{" "}
            </h1>
            <button className="py-2 px-4 hover:bg-accentHover bg-accent rounded-lg transition-all duration-200 mt-2">
              <a
                href="/register"
                className="text-xl font-medium mt-4 text-white "
              >
                Register Now
              </a>
            </button>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center w-full md:w-[40%] mt-4 md:mt-0">
          <img src="/line-chart.png" className="md:w-108 w-48" alt="image" />
        </div>
      </div>
      <div className="md:my-10 my-6">
        <h1 className="text-4xl font-semibold text-textPrimary">What We Offer</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 md:gap-10 gap-4 mt-4 w-full">
        {
          offers.map((offer, index) => (
            <div
              key={index}
              className="bg-surface rounded-lg shadow-glow-accent p-8 flex flex-col justify-center items-center hover:-translate-y-2 transition-all duration-200"
            >
              <img src={offer.icon} className="w-16 h-16 mb-4" alt="" />
              <h1 className="text-2xl font-semibold text-textPrimary text-center">
                {offer.title}
              </h1>
              <p className="text-md leading-tight text-textSecondary text-left mt-2 font-medium">
                {offer.description}
              </p>
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default Home;