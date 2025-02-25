"use client";

import React, { useRef, useCallback, useEffect, FC, JSX, useState } from "react";

interface DropdownProps {
  items: { label: string | JSX.Element, onClick?: () => void }[];
  ariaLabel?: string;
  buttonLabel?: string | JSX.Element;
  buttonClassName?: string;
  disabled?: boolean; 
  tickSelected?: boolean; 
  defaultSelectedLabel?: string;
}

const Dropdown: FC<DropdownProps> = ({ items, ariaLabel, buttonLabel, buttonClassName, disabled, tickSelected, defaultSelectedLabel }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownContainerRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const activateDropdown = () => {
    if (dropdownRef.current) {
      dropdownRef.current.classList.toggle("show");
    } 
  };

  const hideDropdown = () => {
    if (dropdownRef.current) {
      dropdownRef.current.classList.remove("show");
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
    <div className="dropdown" ref={dropdownContainerRef}>
      <button
        onClick={activateDropdown}
        className={`dropdown-button ${buttonClassName}`}
        aria-label={ariaLabel}
        disabled={disabled}
      >
        <span>{buttonLabel}</span>
      </button>
      <div
        ref={dropdownRef}
        className="dropdown-content"
        tabIndex={-1}
      >
        <div className="dropdown-items">
          {items.map(({ label, onClick }, i) => (
            <div
              key={i}
              className="dropdown-item"
              onClick={() => {
                if (onClick) {
                  onClick();
                  hideDropdown();
                  setSelectedIndex(i);
                }
              }}
              aria-label={typeof label === "string" ? label : undefined}
              role="menuitem"
            >
              {label}
              {tickSelected && (selectedIndex === i || typeof label === "string" && defaultSelectedLabel === label) &&  
                <span className="select-item-icon-check">
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
                </span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
