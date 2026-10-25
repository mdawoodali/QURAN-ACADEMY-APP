"use client";

import { useRouter } from "next/navigation";
import WelcomeSplash from "@/components/WelcomeSplash";

export default function WelcomePage() {
  const router = useRouter();

  const handleGetStarted = (sect?: "sunni" | "shia") => {
    if (sect === "shia") {
      router.push("/shia/home");
    } else {
      router.push("/sunni/home");
    }
  };

  return <WelcomeSplash onGetStarted={handleGetStarted} />;
}
