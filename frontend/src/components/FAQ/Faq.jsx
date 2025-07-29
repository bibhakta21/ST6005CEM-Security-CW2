import React from "react";
import { Link as ScrollLink, Element } from "react-scroll";

const faqs = [
  {
    question: "How do I return my item?",
    id: "return-item",
    answer: `Returning your item is simple and hassle-free. If you're not completely satisfied with your watch, you can initiate a return within 14 days of delivery...`,
  },
  {
    question: "What are the most common reasons for delivery delays?",
    id: "delivery-delays",
    answer: `Delivery delays can occur due to weather conditions, customs clearance, or high order volumes during festive seasons...`,
  },
  {
    question: "How to contact us?",
    id: "contact-us",
    answer: `You can contact us via our Help Center by submitting a support ticket, starting a live chat, or emailing our support team...`,
  },
  {
    question: "What is warranty policy?",
    id: "warranty-policy",
    answer: `All watches come with a 1-year warranty that covers manufacturing defects. Damage due to misuse or accidents is not covered...`,
  },
  {
    question: "Why am I encountering errors while placing an order?",
    id: "order-errors",
    answer: `Errors may occur due to invalid payment details, expired cards, or poor internet connectivity. Try again or contact support...`,
  },
  {
    question: "What is return policy in samaya?",
    id: "samaya-return-policy",
    answer: `Samaya follows the same return policy—items must be returned within 14 days in original condition and packaging...`,
  },
];

export default function FAQPage() {
  return (
    <div className="flex flex-col md:flex-row p-6 md:p-12  gap-10">
     
      <div className="md:w-1/3 space-y-6">
        {faqs.map((faq) => (
          <ScrollLink
            key={faq.id}
            to={faq.id}
            smooth={true}
            duration={500}
            offset={-80}
            className="cursor-pointer text-lg font-medium text-gray-800 hover:text-blue-600 border-b border-dotted border-gray-400 pb-2 block"
          >
            {faq.question}
          </ScrollLink>
        ))}
      </div>

     
      <div className="md:w-2/3 space-y-10">
        {faqs.map((faq) => (
          <Element key={faq.id} name={faq.id} className="scroll-mt-20">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{faq.question}</h2>
            <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
          </Element>
        ))}
      </div>
    </div>
  );
}
