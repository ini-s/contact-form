import { SubmitHandler, useForm } from "react-hook-form";
import isEmail from "validator/lib/isEmail";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import { toast } from "react-toastify";

import styles from "./contact.module.css";

const SPREADSHEET_ID = process.env.NEXT_PUBLIC_SPREADSHEET_ID!;
const SHEET_ID = process.env.NEXT_PUBLIC_SHEET_ID!;
const GOOGLE_CLIENT_EMAIL = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_EMAIL;
const GOOGLE_SERVICE_PRIVATE_KEY = process.env.GOOGLE_SERVICE_PRIVATE_KEY!;

console.log(SPREADSHEET_ID);

interface ContactProps {
  name: string;
  email: string;
  message: string;
}

const serviceAccountAuth = new JWT({
  email: GOOGLE_CLIENT_EMAIL,
  key: GOOGLE_SERVICE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth);
console.log(doc.loadInfo);

const defaultValues = {
  name: "",
  email: "",
  message: "",
};

const Contact = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactProps>({ defaultValues });

  const [isLoading, setIsLoading] = useState(false);

  const appendSpreadsheet = async (row: ContactProps) => {
    try {
      await doc.loadInfo();

      const sheet = doc.sheetsById[parseInt(SHEET_ID)];
      const rowData: Record<string, string> = {
        Name: row.name,
        Email: row.email,
        Message: row.message,
      };
      await sheet.addRow(rowData);
      console.log("row added successfully");
      toast.success("Message sent successfully");
      setIsLoading(false);
    } catch (e) {
      console.error("Error: ", e);
    }
  };

  const onSubmit: SubmitHandler<ContactProps> = async (data) => {
    setIsLoading(true);
    appendSpreadsheet(data);
    reset();
  };

  return (
    <section className={styles.contact} id="contact">
      <div className={styles.formTop}>
        <h2>CONTACT</h2>
        <h3>Get In Touch</h3>
      </div>
      <div className={styles.contactFormContainer}>
        <motion.div
          className={styles.contactForm}
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.formInputContainer}>
              <input
                className={styles.formInput}
                {...register("name", {
                  required: "Please enter your name",
                })}
                type="text"
                placeholder="Name"
              />
              {errors?.name && (
                <p className={styles.inputFooterText}>
                  {errors?.name?.message}
                </p>
              )}
            </div>
            <div className={styles.formInputContainer}>
              <input
                className={styles.formInput}
                {...register("email", {
                  required: "Please enter your email address",
                  validate: {
                    isValid: (val) =>
                      isEmail(val) || "Please enter a valid email address",
                  },
                })}
                type="email"
                placeholder="Email"
              />
              {errors?.email && (
                <p className={styles.inputFooterText}>
                  {errors?.email?.message}
                </p>
              )}
            </div>
            <div className={styles.formInputContainer}>
              <textarea
                className={styles.formInput}
                {...register("message", {
                  required: "Please enter a message",
                })}
                placeholder="Enter message here..."
              />
              {errors?.message && (
                <p className={styles.inputFooterText}>
                  {errors?.message?.message}
                </p>
              )}
            </div>
            <button className={styles.formBtn} type="submit">
              {isLoading ? "Loading..." : "Send Message"}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
