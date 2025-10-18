import React from "react";

const FAQs = ({faq}) => {
  return (
    <div className="mb-4">
      <p className="font-semibold text-textPrimary">
        <span className="text-accent font-bold">Q.</span> {faq.question}
      </p>
      <p className="text-textSecondary">
        <span className="text-accent font-normal">A.</span> {faq.answer}
      </p>
    </div>
  );
};

export default FAQs;
