import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: "How do I book a tour on Briskode Tours?",
    answer: "Booking is simple! Browse our Packages page, select your desired destination, choose your dates and number of guests on the Tour Details page, and click 'Proceed to Book'. You can then complete your payment securely."
  },
  {
    question: "What is your cancellation policy?",
    answer: "You can cancel for a full refund up to 7 days before your tour's start date. Cancellations made within 7 days of the tour are subject to a 50% cancellation fee. No-shows will not be refunded."
  },
  {
    question: "Are flights included in the package prices?",
    answer: "No, our standard packages cover accommodation, guided tours, local transfers, and specified meals. International or domestic flights to the starting destination are not included unless explicitly stated in the tour details."
  },
  {
    question: "Is it safe to pay online through your platform?",
    answer: "Absolutely. We use industry-standard encryption and partner with secure payment gateways to ensure your financial data is completely protected."
  },
  {
    question: "Can I customize a tour package?",
    answer: "Currently, our packages are pre-set to offer the best curated experience. However, if you have a group of 6 or more, please contact our support team to discuss private, customized itineraries."
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-gray-50 dark:bg-slate-950 min-h-screen py-20 transition-colors duration-300">
      {/* Header */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16 mt-8">
        <div className="inline-flex items-center justify-center bg-primary-100 dark:bg-primary-900/30 p-4 rounded-full mb-6">
          <HelpCircle size={40} className="text-primary-600 dark:text-primary-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-lg text-gray-500 dark:text-slate-400 font-medium">
          Got questions? We've got answers. If you can't find what you're looking for, feel free to contact our support team.
        </p>
      </div>

      {/* Accordion */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`bg-white dark:bg-slate-900 rounded-2xl border transition-all duration-300 ${
                openIndex === index 
                  ? 'border-primary-500 dark:border-primary-500 shadow-md shadow-primary-500/10' 
                  : 'border-gray-200 dark:border-slate-800 shadow-sm hover:border-primary-300 dark:hover:border-primary-800'
              }`}
            >
              <button
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                onClick={() => toggleFAQ(index)}
              >
                <span className={`font-bold text-lg ${
                  openIndex === index ? 'text-primary-600 dark:text-primary-400' : 'text-slate-900 dark:text-white'
                }`}>
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="text-primary-500 flex-shrink-0 ml-4" size={20} />
                ) : (
                  <ChevronDown className="text-slate-400 dark:text-slate-500 flex-shrink-0 ml-4" size={20} />
                )}
              </button>
              
              <div 
                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-gray-600 dark:text-slate-400 font-medium leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;