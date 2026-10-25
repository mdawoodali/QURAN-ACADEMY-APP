"use client";

import { useEffect } from "react";
import { useSect } from "@/components/SectContext";
import HomeView from "@/components/HomeView";

export default function ShiaHomePage() {
  const { setSect, sect } = useSect();

  useEffect(() => {
    if (sect !== "shia") {
      setSect("shia");
    }
  }, [sect, setSect]);

  return <HomeView />;
}
