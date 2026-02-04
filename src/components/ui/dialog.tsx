import React from "react";

export const Dialog = ({ open, onOpenChange, children }: any) => {
  if (!open) return null;
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={() => onOpenChange(false)}
    >
      <div onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export const DialogContent = ({ children, className }: any) => (
  <div className={`bg-white rounded-lg shadow-lg relative z-50 w-full ${className}`}>
    {children}
  </div>
);

// AQUI ESTAVA O ERRO: Agora está corrigido com </h2> no final
export const DialogTitle = ({ children, className }: any) => (
  <h2 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h2>
);

export const DialogHeader = ({ children }: any) => <div className="flex flex-col space-y-1.5 text-center sm:text-left">{children}</div>;
export const DialogFooter = ({ children }: any) => <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">{children}</div>;