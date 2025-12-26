import { Suspense } from "react";
import ActivatePasswordForm from "./ActivatePasswordForm";
import { LoadingModal } from "@/components/ui/loading";

export default function ActivateAccountPage() {
  return (
    <Suspense fallback={<LoadingModal />}>
      <ActivatePasswordForm />
    </Suspense>
  );
}
