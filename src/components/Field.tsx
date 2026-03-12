import React from 'react';

interface FieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  req?: boolean;
  onChange?: any;
}

export function Field({ label, req, ...props }: FieldProps) {
  return (
    <div className="flex flex-col gap-[5px]">
      <div className="text-[10px] tracking-[0.15em] uppercase text-accent3 flex justify-between items-center">
        {label} {req && <span className="text-accent2 text-[10px]">*</span>}
      </div>
      <input
        {...props}
        className="bg-bg border border-border text-text font-mono text-[12px] p-[9px_12px] outline-none transition-colors focus:border-accent w-full"
      />
    </div>
  );
}

interface SelectFieldProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label: string;
  req?: boolean;
  options: string[];
  onChange?: any;
}

export function SelectField({ label, req, options, ...props }: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-[5px]">
      <div className="text-[10px] tracking-[0.15em] uppercase text-accent3 flex justify-between items-center">
        {label} {req && <span className="text-accent2 text-[10px]">*</span>}
      </div>
      <select
        {...props}
        className="bg-bg border border-border text-text font-mono text-[12px] p-[9px_12px] outline-none transition-colors focus:border-accent w-full"
      >
        <option value="">Selecione...</option>
        {options.map((opt, i) => (
          <option key={i} value={opt} className="bg-bg">{opt}</option>
        ))}
      </select>
    </div>
  );
}
