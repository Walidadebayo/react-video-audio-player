"use client";

import React, { useRef, useCallback, useEffect, FC, JSX } from "react";

interface DropdownProps {
  items: { label: string; onClick?: () => void }[];
  ariaLabel?: string;
  buttonLabel?: string | JSX.Element;
  buttonClassName?: string;
  disabled?: boolean;
}

const Dropdown: FC<DropdownProps> = ({ items, ariaLabel, buttonLabel, buttonClassName, disabled }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownContainerRef = useRef<HTMLDivElement>(null);

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
