"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


// Define a proper user type instead of using `any`

export default function DashboardPage() {
  const [user, setUser] = useState<{ id: string; email: string; name?: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:3001/me", {
          method: "GET",
          credentials: "include", // ✅ send cookies
        });

        if (res.status === 401) {
          router.push("/login"); // not authenticated → redirect
          return;
        }

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
        router.push("/login");
      }
    };

    fetchUser();
  }, [router]);


  if (!user) return <p>Loading...</p>;

  return (
    <div className="flex flex-col items-center mt-20">
      <h1 className="text-2xl mb-4">Welcome, {user.name || user.email}!</h1>
      <p>Your ID: {user.id}</p>
    </div>
  );
}
