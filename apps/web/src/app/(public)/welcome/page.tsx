"use client";

import { useRouter } from "next/navigation";
import WelcomeSplash from "@/components/WelcomeSplash";

export default function WelcomePage() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/");
  };

  return <WelcomeSplash onGetStarted={handleGetStarted} />;
}
