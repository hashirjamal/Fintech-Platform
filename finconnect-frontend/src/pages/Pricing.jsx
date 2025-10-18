import React, { useEffect, useState } from "react";
import PlanCard from "../components/PlanCard";
import FAQs from "../components/FAQs";
import ErrorPage from "../components/ErrorPage";
import { useContext } from "react";
import { UserContext } from "../context/Context";
import axios from "axios";

const Pricing = () => {
  const { isLoggedIn, setCurrentPage, isSubscribed, user } =
    useContext(UserContext);
  const currentSubscription = isSubscribed ? user?.Subscription : null;
  const [plans, setPlans] = useState([]);
  useEffect(() => {
    setCurrentPage("pricing");
  }, [setCurrentPage]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/subscription`,
          { withCredentials: true },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setPlans(response.data?.subscriptions);
        console.log(response.data?.subscriptions,"pricing");
      } catch (error) {
        console.error("Error fetching plans:", error);
      }
    };
    fetchPlans();
  }, []);

  const plan = plans?.map((item) => ({
    id: item.subscriptionId,
    name: item.name,
    price: item.price,
    description: item.description,
    price_id: item.price_id,
    features: [
      `✔ Transfer Limit: Rs. ${item.transactionLimit}`,
      `✔ ${
        item.transactionPerDay == 999999 ? "Unlimited" : item.transactionPerDay
      } Transfers/day`,
      item.invoice ? "✔ Invoice Generation" : "❌ Invoice Generation",
      item.priority ? "✔ Priority Support" : "❌ Priority Support",
    ],
  }));

  const faqs = [
    {
      question: "Can I cancel anytime?",
      answer:
        "Yes, you can cancel your subscription at any point directly from dashboard.",
    },
    {
      question: "Do I need a credit card for the trial?",
      answer:
        "Not for the Pro plan. Paid plans require a card via Stripe (test mode).",
    },
    {
      question: "Is there a free tier?",
      answer:
        "You can register and view pricing, but dashboard access requires a subscription.",
    },
  ];
  return (
    <>
      {isLoggedIn ? (
        <div className="min-h-content py-12 px-6">
          <h1 className="text-5xl font-bold text-center text-accent mb-6">
            Choose Your Plan
          </h1>
          <p className="text-center text-xl text-textPrimary mb-12">
            Flexible pricing for developers and teams. Cancel anytime.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
            {plan.map((item, index) => (
              <PlanCard
                key={index}
                item={item}
                currentSubscription={currentSubscription}
                subscriptionInfo = {{price_id:item.price_id, subscriptionId:item.id}}
              />
            ))}
          </div>

          <div className="max-w-5xl mx-auto bg-surface border-accent border p-6 rounded-2xl shadow-lg flex justify-center flex-col space-y-4">
            <h3 className="text-3xl text-accent font-semibold mb-4 text-center">
              Frequently Asked Questions (FAQs)
            </h3>
            {faqs.map((faq, index) => (
              <FAQs key={index} faq={faq} />
            ))}
          </div>
        </div>
      ) : (
        <ErrorPage
          message="You are not authorized to view this page. Please login to access the pricing page."
          status="403"
        />
      )}
    </>
  );
};

export default Pricing;
