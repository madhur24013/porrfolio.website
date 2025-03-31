import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";

import { styles } from "../styles";
import { EarthCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { slideIn } from "../utils/motion";

// EmailJS configuration
const SERVICE_ID = "service_ijilvpi";
const TEMPLATE_ID = "template_xegmu95";
const PUBLIC_KEY = "uA87hnLDqo7V2rrMK";

const Contact = () => {
  const formRef = useRef();
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [emailStatus, setEmailStatus] = useState({ sent: false, error: null });

  useEffect(() => {
    // Initialize EmailJS with your public key
    emailjs.init(PUBLIC_KEY);
    console.log("EmailJS initialized with PUBLIC_KEY:", PUBLIC_KEY);
    
    // Check network status
    const checkNetwork = () => {
      if (navigator.onLine) {
        console.log("✅ Network is online");
      } else {
        console.log("❌ Network is offline");
      }
    };
    
    checkNetwork();
    window.addEventListener('online', checkNetwork);
    window.addEventListener('offline', checkNetwork);
    
    return () => {
      window.removeEventListener('online', checkNetwork);
      window.removeEventListener('offline', checkNetwork);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setEmailStatus({ sent: false, error: null });

    const currentTime = new Date().toLocaleString();
    
    const templateParams = {
      from_name: form.name,
      from_email: form.email,
      message: form.message,
      to_name: "Madhur Haryan",
      to_email: "haryanmadhur@gmail.com",
      time: currentTime,
      subject: `New Contact Form Message from ${form.name}`,
      reply_to: form.email,
      website: "Portfolio Website"
    };

    console.log("📧 Sending email with params:", templateParams);
    console.log("📧 Using SERVICE_ID:", SERVICE_ID);
    console.log("📧 Using TEMPLATE_ID:", TEMPLATE_ID);

    emailjs
      .send(
        SERVICE_ID,
        TEMPLATE_ID,
        templateParams,
        PUBLIC_KEY
      )
      .then(
        (response) => {
          setLoading(false);
          console.log("✅ EMAIL SENT SUCCESSFULLY!", response.status, response.text);
          setEmailStatus({ sent: true, error: null });
          alert("Thank you for your message! I will get back to you soon.");

          setForm({
            name: "",
            email: "",
            message: "",
          });
        },
        (error) => {
          setLoading(false);
          console.error("❌ EMAIL FAILED TO SEND:", error);
          console.error("Error details:", {
            text: error.text,
            status: error.status,
            message: error.message
          });
          setEmailStatus({ sent: false, error: error });
          alert("Something went wrong. Please try again.");
        }
      );
  };

  return (
    <div className="xl:mt-12 xl:flex-row flex-col-reverse flex gap-10 overflow-hidden">
      <motion.div
        variants={slideIn("left", "tween", 0.2, 1)}
        className="flex-[0.75] bg-black-100 p-8 rounded-2xl"
      >
        <p className={styles.sectionSubText}>Get in touch</p>
        <h3 className={styles.sectionHeadText}>Contact.</h3>

        <form onSubmit={handleSubmit} className="mt-12 flex flex-col gap-8">
          <label className="flex flex-col">
            <span className="text-white font-medium mb-4">Your Name</span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="What's your name?"
              className="bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outlined-none border-none font-medium"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-white font-medium mb-4">Your Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="What's your email?"
              className="bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outlined-none border-none font-medium"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-white font-medium mb-4">Your Message</span>
            <textarea
              rows="7"
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="What do you want to say?"
              className="bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outlined-none border-none font-medium"
            />
          </label>

          <button
            type="submit"
            className="bg-tertiary py-3 px-8 outline-none w-fit text-white font-bold shadow-md shadow-primary rounded-xl"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">↻</span> 
                Sending...
              </span>
            ) : (
              "Send"
            )}
          </button>
        </form>
      </motion.div>

      <motion.div
        variants={slideIn("right", "tween", 0.2, 1)}
        className="xl:flex-1 xl:h-auto md:h-[550px] h-[350px]"
      >
        <EarthCanvas />
      </motion.div>
    </div>
  );
};

export default SectionWrapper(Contact, "contact");
