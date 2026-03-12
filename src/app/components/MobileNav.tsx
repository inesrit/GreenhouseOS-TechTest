/**
 * MobileNav Component
 * Responsive navigation menu for mobile devices with toggle functionality
 */
"use client";

import { useState } from "react";
import { UI_TEXT } from "@/constants";


export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <div className="hidden md:flex gap-6 text-sm">
        <a href="/" className="hover:underline">{UI_TEXT.NAV_PROPERTIES}</a>
        <a href="#" className="hover:underline">{UI_TEXT.NAV_DASHBOARD}</a>
        <a href="#" className="hover:underline">{UI_TEXT.NAV_SETTINGS}</a>
      </div>

      <button
        onClick={toggleMenu}
        className="md:hidden flex flex-col justify-center items-center w-8 h-8 cursor-pointer"
        aria-label="Toggle navigation menu"
        aria-expanded={isOpen}
      >
        <span 
          className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
            isOpen ? "rotate-45 translate-y-2" : "mb-1.5"
          }`}
        />
        <span 
          className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
            isOpen ? "opacity-0" : "mb-1.5"
          }`}
        />
        <span 
          className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
            isOpen ? "-rotate-45 -translate-y-2" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-green-800 flex flex-col text-sm shadow-lg z-50">
          <a 
            href="/" 
            onClick={closeMenu}
            className="px-6 py-3 hover:bg-green-900 border-b border-green-700"
          >
            {UI_TEXT.NAV_PROPERTIES}
          </a>
          <a 
            href="#" 
            onClick={closeMenu}
            className="px-6 py-3 hover:bg-green-900 border-b border-green-700"
          >
            {UI_TEXT.NAV_DASHBOARD}
          </a>
          <a 
            href="#" 
            onClick={closeMenu}
            className="px-6 py-3 hover:bg-green-900"
          >
            {UI_TEXT.NAV_SETTINGS}
          </a>
        </div>
      )}
    </>
  );
}
