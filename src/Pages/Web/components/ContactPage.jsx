import React from "react";
import { ContactForm } from "./ContactForm";
import { Cta } from "./Cta";
import { Newsletter } from "./Newsletter";

export const Contact = () => {
  return (
    <div className="space-y-20">
      <ContactForm />
      <Cta />
      <Newsletter />
    </div>
  );
};
