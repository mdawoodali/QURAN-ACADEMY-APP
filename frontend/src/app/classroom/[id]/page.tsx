import { Suspense } from "react";
import LiveClassroom from "@/components/LiveClassroom";

export default function ClassroomPage() {
  return (
    <div className="h-full w-full">
      <Suspense fallback={<div className="p-8 text-emerald-800">Loading classroom...</div>}>
        <LiveClassroom />
      </Suspense>
    </div>
  );
}
