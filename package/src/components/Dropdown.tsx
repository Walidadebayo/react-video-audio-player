"use client";

import React, { useRef, useCallback, useEffect, FC, JSX } from "react";

interface DropdownProps {
  items: { label: string; onClick?: () => void }[];
  ariaLabel?: string;
  buttonLabel?: string | JSX.Element;
  buttonClassName?: string;
}

const Dropdown: FC<DropdownProps> = ({ items, ariaLabel, buttonLabel, buttonClassName }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownContainerRef = useRef<HTMLDivElement>(null);

  const activateDropdown = () => {
    if (dropdownRef.current) {
      dropdownRef.current.classList.toggle("hidden");
    }
  };

  const hideDropdown = () => {
    if (dropdownRef.current) {
      dropdownRef.current.classList.add("hidden");
    }
  };

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      dropdownContainerRef.current &&
      !dropdownContainerRef.current.contains(event.target as Node)
    ) {
      hideDropdown();
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div className="relative inline-block" ref={dropdownContainerRef}>
      <button
        onClick={activateDropdown}
        className={`
          items-center justify-between whitespace-nowrap rounded-md border border-input  bg-transparent text-md focus:outline-none  
          [&>span]:line-clamp-1 w-min border-none  focus:ring-0 p-1 h-full text-gray-700 dark:text-gray-100 ${buttonClassName}
          `}
        aria-label={ariaLabel}
      >
        <span>{buttonLabel}</span>
      </button>
      <div
        ref={dropdownRef}
        className="absolute top-9 left-1/2 transform -translate-x-1/2 hidden"
        tabIndex={-1}
      >
        <div className="relative z-50 p-1 max-h-96 min-w-[8rem] overflow-hidden space-y-1 rounded-md border bg-slate-50 dark:bg-gray-900 shadow-md">
          {items.map(({ label, onClick }, i) => (
            <div
              key={i}
              className={`relative flex w-full hover:bg-gray-200 
                dark:hover:bg-gray-500 cursor-pointer select-none items-center 
                rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none`}
              onClick={() => {
                if (onClick) {
                  onClick();
                  hideDropdown();
                }
              }}
              aria-label={label}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
