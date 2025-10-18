import React, { useState } from "react";
import { useContext } from "react";
import { UserContext } from "../context/Context";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import { BiNavigation } from "react-icons/bi";
import toast from "react-hot-toast";
import axios from "axios";
import Modal3 from "../components/Modal3";

const Account = () => {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false);
  const [delOpen, setDelOpen] = useState(false)
  const { isLoggedIn, setCurrentPage, isSubscribed, user } =
    useContext(UserContext);

  useEffect(() => {
    setCurrentPage("account");
  }, [setCurrentPage]);

  const [portalURL,setPortalURL] = useState(null)


const goToPortal = async()=>{
  try{
    let userId = JSON.parse(localStorage.getItem("user"))
    console.log(userId)
    userId = userId.accountNumber
    const res = await axios.post("http://localhost:8000/api/pay/customerPortal",{
      userId
    })

    setPortalURL(res.data.customerPortal)
  }

  catch(e){
    toast.error("Could not redirect to stripe portal")
    console.log(e)
  }
}


  const cards = [
    {
      title: "Stripe Account",
      description: "Click the button below to manage your Stripe account.",
      buttonText: "Go to Stripe Portal",
      onClick: () => goToPortal(),
    },
    {
      title: "Cancel Subscription",
      description:
        "Click the button below to cancel your subscription and stop payments.",
      buttonText: "Cancel Subscription",
      onClick: () => setOpen(true),
    }
  ];
  return (
    <>
      {isLoggedIn && isSubscribed ? (
        <div className="min-h-content py-4 sm:px-6 px-2">
          <h1 className="sm:text-5xl text-4xl font-bold text-center text-accent mb-6">
            Manage Your Account
          </h1>
          <div className="grid md:grid-cols-2 justify-center grid-cols-1 gap-8 md:mt-12">
            {cards.map((card, index) => (
              <div
                key={index}
                className="bg-surface rounded-lg shadow-glow-accent p-4 flex flex-col justify-center items-center"
              >
                <h2 className="text-3xl font-bold text-accent text-center mb-2">
                  {card.title}
                </h2>
                <p className="text-textPrimary text-md mb-4 text-center">
                  {card.description}
                </p>
                <button
                  onClick={card.onClick}
                  className="bg-accent hover:cursor-pointer hover:bg-accentHover my-4 text-white py-2 px-4 rounded-lg transition duration-200"
                >
                  {card.buttonText}
                </button>
                {(card.title=="Stripe Account" && portalURL) &&  <a
                  href={portalURL}
                  className="text-blue-400 flex items-center gap-2 hover:cursor-pointer hover:bg-white hover:text-blue-950 underline py-2 px-2 rounded-lg transition duration-200"
                >
                 PORTAL URL <BiNavigation />
                </a>}
              </div>
            ))}
          </div>
          {/* {open && (
            <Modal
              setOpen={setOpen}
              title="Cancel Subscription"
              message=" We are sorry to see you go. Are you sure you want to
                      cancel your subscription? This action cannot be undone."
              buttonText="Unsubscribe"
              action = {() => navigate("/unsubscribe")}
            />
          )} */}
          {delOpen && (
            <Modal3
              setOpen={setDelOpen}
              title="Cancel Subscription"
              message=" We are sorry to see you go. Are you sure you want to
                      cancel your subscription? This action cannot be undone."
              buttonText="Unsubscribe"
              
            />
          )}
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center min-h-[80vh] bg-background text-textPrimary mt-4">
          <h1 className="text-3xl text-accent">
            You are either not logged in or subscribed. Please Login and
            Subscribe to access this page
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
    </>
  );
};

export default Account;
