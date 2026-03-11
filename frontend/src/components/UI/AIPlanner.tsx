import type { ChangeEventHandler } from "react";

interface inputprops{
  name:string,
  placeholder:string,
  disabled:boolean,
  onChange:ChangeEventHandler,
 value: number | string;
}

interface targetprops{
   icon: React.ReactNode;
    label:string,
    value:number|string
}

export function TargetCard({ icon, label, value }:targetprops) {
  return (
    <div className="bg-amber-800/10 hover:-translate-y-1 
        transition-all duration-200 p-4 rounded-xl flex items-center gap-3">
      <div className="text-avocado-smoothie">{icon}</div>

      <div>
        <p className=" text-gray-800">{label}</p>
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  );
}
export function Input({ name, placeholder,value, disabled, onChange }:inputprops) {
  return (
    <input
      type="number"
      name={name}
      disabled={disabled}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-avocado-smoothie outline-none transition"
    />
  );
}