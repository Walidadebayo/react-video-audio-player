"use client";

import React, {
  useRef,
  useCallback,
  useEffect,
  FC,
  useState,
  JSX,
} from "react";

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
      selectRef.current.classList.toggle("show");
    }
  };

  const closeSelect = () => {
    if (selectRef.current) {
      selectRef.current.classList.remove("show");
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
    <div className="dropdown" ref={selectContainerRef}>
      <button
        onClick={openSelect}
        className="dropdown-button accent-color-hover"
        aria-label={ariaLabel}
      >
        <span>{label || "Select an option"}</span>
      </button>
      <div ref={selectRef} className="select-content" tabIndex={-1}>
        <div className="dropdown-items">
          {items.map(({ label, value }) => (
            <div
              key={value}
              className={`dropdown-item
                 ${
                   selectedValue === value ? "selected" : ""
                 }`}
              onClick={() => handleClick(value, label)}
              aria-label={typeof label === "string" ? label : value.toString()}
            >
              {label}
              {selectedValue === value && (
                <span className="select-item-icon-check ">
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
