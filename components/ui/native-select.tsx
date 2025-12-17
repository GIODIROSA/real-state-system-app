import * as React from "react";

import { cn } from "@/lib/utils";

const NativeSelect = React.forwardRef<
  HTMLSelectElement,
  React.ComponentProps<"select">
>(({ className, children, ...props }, ref) => {
  return (
    <div className="relative">
      <select
        className={cn(
          "flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
      {/* Nota: El icono de la flecha es renderizado por el navegador por defecto.
         Si quisieras uno custom, tendrías que añadir 'appearance-none' a las clases 
         y poner un icono SVG absoluto aquí. Por ahora, nativo es más robusto.
      */}
    </div>
  );
});

NativeSelect.displayName = "NativeSelect";

export { NativeSelect };
