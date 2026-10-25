"use client";

import { useEffect } from "react";
import { useSect } from "@/components/SectContext";
import HomeView from "@/components/HomeView";

export default function SunniPage() {
  const { setSect, sect } = useSect();

  useEffect(() => {
    if (sect !== "sunni") {
      setSect("sunni");
    }
  }, [sect, setSect]);

  return <HomeView />;
}
