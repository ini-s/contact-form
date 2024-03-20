import Contact from "@/components/Contact/Contact";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  return (
    <>
      <main>
        <Contact />
      </main>
      <ToastContainer position="top-center" />
    </>
  );
}
