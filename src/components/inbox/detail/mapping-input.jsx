import { cn } from "@/lib/utils";
import SuccessOutlineIcon from "@/assets/icons/success-outline-icon.svg?react";
import AlertOutlineIcon from "@/assets/icons/alert-outline-icon.svg?react";

function applyDateMask(value) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 4) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;
}

const STATE_STYLES = {
  success: {
    wrapper: "border-state-success",
    input: "text-gray-500 placeholder:text-gray-300",
    Icon: SuccessOutlineIcon,
  },
  error: {
    wrapper: "border-state-error",
    input: "text-state-error placeholder:text-state-error",
    Icon: AlertOutlineIcon,
  },
  idle: {
    wrapper: "border-gray-200",
    input: "text-gray-500 placeholder:text-gray-300",
    Icon: null,
  },
};

function getState(value, error) {
  if (error) return "error";
  if (value != null && String(value).trim() !== "") return "success";
  return "idle";
}

function MappingInput({ value, onChange, placeholder, error, mask }) {
  const state = getState(value, error);
  const { wrapper, input, Icon } = STATE_STYLES[state];

  const handleChange = (e) => {
    const raw = e.target.value;
    onChange(mask === "date" ? applyDateMask(raw) : raw);
  };

  return (
    <div className="flex flex-col gap-1">
      <div
        className={cn(
          "flex items-center gap-2 rounded-xs border px-3 py-2",
          wrapper,
        )}
      >
        <input
          value={value ?? ""}
          onChange={handleChange}
          placeholder={mask === "date" ? "YYYY-MM-DD" : placeholder}
          className={cn(
            "flex-1 bg-transparent text-[18px] outline-none",
            input,
          )}
        />
        {Icon && <Icon className="size-6 shrink-0" />}
      </div>
      {error && <span className="text-state-error text-[15px]">{error}</span>}
    </div>
  );
}

export default MappingInput;
