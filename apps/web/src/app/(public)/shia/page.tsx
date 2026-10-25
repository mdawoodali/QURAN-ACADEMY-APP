"use client";

import { useRouter } from "next/navigation";
import WelcomeSplash from "@/components/WelcomeSplash";

export default function ShiaWelcomePage() {
  const router = useRouter();

  return (
    <WelcomeSplash
      targetSect="shia"
      onGetStarted={() => {
        router.push("/shia/home");
      }}
    />
  );
}
