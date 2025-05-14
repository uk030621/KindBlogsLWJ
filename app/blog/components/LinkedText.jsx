// app/blog/components/LinkedText.jsx
"use client";

import Linkify from "linkify-react";

const options = {
  defaultProtocol: "https",
  target: "_blank",
  rel: "noopener noreferrer",
  className: "text-blue-600 underline font-medium", // 💡 Style the link itself
};

export default function LinkedText({ text, className }) {
  return (
    <div className={className}>
      <Linkify options={options}>{text}</Linkify>
    </div>
  );
}
