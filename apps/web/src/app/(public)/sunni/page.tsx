"use client";

import { useRouter } from "next/navigation";
import WelcomeSplash from "@/components/WelcomeSplash";

export default function SunniWelcomePage() {
  const router = useRouter();

  return (
    <WelcomeSplash
      targetSect="sunni"
      onGetStarted={() => {
        router.push("/sunni/home");
      }}
    />
  );
}
