"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { ColorPicker, IColor } from "react-color-palette";
import "react-color-palette/css";

interface ColorPickerProps {
  color: IColor
  onChange?: (color: IColor) => void;
  onChangeComplete?: (color: IColor) => void;
}

export default function CustomColorPicker({
  color,
  onChange,
  onChangeComplete,
}: ColorPickerProps) {
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const colorPicker = useRef<HTMLDivElement>(null);

  const openColorPicker = () => {
    if (colorPicker.current) {
      colorPicker.current.classList.toggle("hidden");
    }
  };

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(event.target as Node)
      ) {
        if (colorPicker.current) {
          colorPicker.current.classList.add("hidden");
        }
      }
    },
    [colorPicker],
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div className="relative inline-block" ref={colorPickerRef}>
      <div
        className="flex items-center cursor-pointer hover:bg-slate-300 p-2 rounded-md dark:hover:bg-slate-600/40 shadow-sm"
        onClick={openColorPicker}
      >
        <button
          className="w-6 h-6 rounded-md inline-flex items-center justify-center"
          style={{ backgroundColor: color.hex }}
        ></button>
        <span className="text-gray-500 dark:text-gray-300 ml-2">
          {color.hex}
        </span>
      </div>
      <div
        ref={colorPicker}
        className="absolute bottom-11 left-1/2 transform -translate-x-1/2 hidden"
        tabIndex={-1}
      >
        <ColorPicker
          color={color}
          hideInput={["rgb", "hsv"]}
          onChange={onChange || (() => {})}
          height={120}
          onChangeComplete={onChangeComplete || (() => {})}
        />
      </div>
    </div>
  );
}
