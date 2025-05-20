"use client";

import { useEffect, useState } from "react";

export default function TestSignPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/cloudinary/sign")
      .then((res) => res.json())
      .then(setData)
      .catch((err) => setData({ error: err.message }));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Cloudinary Sign Endpoint Test</h1>
      <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
