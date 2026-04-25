'use client';

interface ConfirmButtonProps {
  action: () => Promise<any>;
  confirmMessage: string;
  children: React.ReactNode;
  className?: string;
}

export default function ConfirmButton({ action, confirmMessage, children, className }: ConfirmButtonProps) {
  return (
    <button
      type="button"
      className={className}
      onClick={async () => {
        if (confirm(confirmMessage)) {
          await action();
        }
      }}
    >
      {children}
    </button>
  );
}
