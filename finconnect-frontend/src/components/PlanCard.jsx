import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/Context";

const PlanCard = ({ item, currentSubscription, subscriptionInfo }) => {
  console.log(currentSubscription);
  const [stripeUrl, setStripeUrl] = useState(null);
  const nav = useNavigate();
  const { isAdmin } = useContext(UserContext);

  const handleSubscribe = async () => {
    try {
      if (isAdmin) {
        toast.error("Admin cannot subscribe to plans.");
        return;
      }
      let { price_id, subscriptionId } = subscriptionInfo;

      let user = JSON.parse(localStorage.getItem("user"));
      let userId = user?.accountNumber;
      console.log(price_id, subscriptionId, userId);

      if (user.isSubscribed) {
        toast.error("Please delete your previous subscription first.");
        return;
      }

      let res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/pay/createSession`,
        {
          userId,
          priceId: price_id,
          subscriptionId,
        }
      );
      console.log(res.data.redirectURL);
      setStripeUrl(res.data.redirectURL);
    } catch (e) {
      console.log(e);
      toast.error(e.message);
    }
  };

  return (
    <div
      className={`bg-surface border border-accent rounded-2xl ${
        item.name == "Premium" && "shadow-glow-accent md:scale-103"
      } p-6 flex flex-col`}
    >
      <h2 className="text-2xl font-bold text-accent mb-2">{item.name}</h2>
      <p className="text-textSecondary mb-4">{item.description}</p>
      <div className="text-4xl text-accent font-bold mb-6">
        ${item.price}
        <span className="text-lg font-medium text-white">/month</span>
      </div>
      <ul className="space-y-3 mb-6 text-textPrimary">
        {item.features.map((feature, i) => (
          <li key={i} className="flex items-center">
            {feature}
          </li>
        ))}
      </ul>
      {currentSubscription && currentSubscription.subscriptionId === item.id ? (
        <button className="mt-auto bg-background border border-accent text-white py-2 rounded-lg transition duration-200 cursor-not-allowed">
          Subscribed
        </button>
      ) : (
        <button
          className="mt-auto mb-6 bg-accent hover:bg-accentHover hover:cursor-pointer text-white py-2 rounded-lg transition duration-200"
          onClick={handleSubscribe}
        >
          Subscribe
        </button>
      )}
      {stripeUrl && (
        <button
          className="mt-auto bg-green-600  hover:bg-accentHover hover:cursor-pointer text-white py-2 rounded-lg transition duration-200"
          onClick={handleSubscribe}
        >
          <a href={stripeUrl}>Make Payment</a>
        </button>
      )}
    </div>
  );
};

export default PlanCard;
