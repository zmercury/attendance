import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: "How does the attendance tracking work?",
    answer: "Our system uses a combination of QR codes, geolocation, and facial recognition to accurately track attendance in real-time."
  },
  {
    question: "Can parents access their child's attendance records?",
    answer: "Yes, parents have access to a dedicated portal where they can view their child's attendance history and receive notifications."
  },
  {
    question: "Is the system compatible with existing school management software?",
    answer: "Absolutely! Our attendance tracker is designed to integrate seamlessly with most popular school management systems."
  },
  {
    question: "How secure is the data stored in the system?",
    answer: "We prioritize data security. All information is encrypted and stored in compliance with GDPR and other relevant data protection regulations."
  }
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="mb-4 border-b border-border pb-4">
              <button
                className="flex justify-between items-center w-full text-left"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="text-xl">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="h-6 w-6 text-primary" />
                ) : (
                  <ChevronDown className="h-6 w-6 text-primary" />
                )}
              </button>
              {openIndex === index && (
                <p className="mt-2 text-muted-foreground">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;