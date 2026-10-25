"use client";

import { useRouter } from "next/navigation";
import WelcomeSplash from "@/components/WelcomeSplash";

export default function WelcomePage() {
  const router = useRouter();

  const handleGetStarted = (sect?: "sunni" | "shia") => {
    if (sect === "shia") {
      router.push("/shia");
    } else {
      router.push("/sunni");
    }
  };

  return <WelcomeSplash onGetStarted={handleGetStarted} />;
}
