import { Suspense } from "react";
import ResetPasswordForm from "./ResetPasswordForm";
import { LoadingModal } from "@/components/ui";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingModal />}>
      <ResetPasswordForm />
    </Suspense>
  );
}