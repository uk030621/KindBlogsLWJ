"use client";
import ContactForm from "../components/ContactForm";
//import Link from "next/link";

export default function Home() {
  return (
    <div className=" background-container">
      <div className="p-4 max-w-3xl mx-auto">
        {/*<Link
          className="bg-amber-200 px-4 py-2 mt-2 rounded-lg text-xs"
          href="\"
        >
          Home
        </Link>*/}
        {/*<h1 className="text-3xl font-bold mt-4 ml-4">Contact Developer</h1>
        <p className="ml-4">Please fill in the form below</p>*/}

        <ContactForm />
      </div>
    </div>
  );
}
