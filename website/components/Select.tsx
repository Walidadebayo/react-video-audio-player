import { useRef, useCallback, useEffect, FC, useState } from "react";

interface SelectProps {
  items: { label: string | JSX.Element; value: string | number }[];
  value?: string | number;
  ariaLabel?: string;
  defaultLabel?: string;
  onClick?: (value: string | number) => void;
}

const Select: FC<SelectProps> = ({
  items,
  value,
  ariaLabel,
  onClick,
  defaultLabel,
}) => {
  const selectRef = useRef<HTMLDivElement>(null);
  const selectContainerRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | JSX.Element>(defaultLabel || "");
  const [selectedValue, setSelectedValue] = useState<
    string | number | undefined
  >(value);

  const openSelect = () => {
    if (selectRef.current) {
      selectRef.current.classList.toggle("hidden");
    }
  };

  const closeSelect = () => {
    if (selectRef.current) {
      selectRef.current.classList.add("hidden");
    }
  };

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      selectContainerRef.current &&
      !selectContainerRef.current.contains(event.target as Node)
    ) {
      closeSelect();
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  const handleClick = (value: string | number, label: string | JSX.Element) => {
    if (onClick) onClick(value);
    setSelectedValue(value);
    setLabel(label);
    closeSelect();
  };

  return (
    <div className="relative inline-block" ref={selectContainerRef}>
      <button
        onClick={openSelect}
        className="items-center justify-between whitespace-nowrap rounded-md border border-input  bg-transparent text-md focus:outline-none  [&>span]:line-clamp-1 w-min border-none  focus:ring-0 p-1 h-full text-gray-700 dark:text-gray-100 accent-color-hover"
        aria-label={ariaLabel}
      >
        <span>{label || "Select an option"}</span>
      </button>
      <div
        ref={selectRef}
        className="absolute bottom-9 left-1/2 transform -translate-x-1/2 hidden"
        tabIndex={-1}
      >
        <div className="relative z-50 p-1 max-h-96 min-w-[8rem] overflow-hidden space-y-1 rounded-md border bg-slate-50 dark:bg-gray-900 shadow-md">
          {items.map(({ label, value }) => (
            <div
              key={value}
              className={`relative flex w-full hover:bg-gray-200 
                dark:hover:bg-gray-500 cursor-pointer select-none items-center 
                rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none ${
                  selectedValue === value ? "bg-gray-200 dark:bg-gray-500" : ""
                }`}
              onClick={() => handleClick(value, label)}
              aria-label={typeof label === "string" ? label : value.toString()}
            >
              {label}
              {selectedValue === value && (
                <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Select;
