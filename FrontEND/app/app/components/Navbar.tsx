"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";


export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsDropdownOpen(false);
    }
  };
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);

  return (
    <header className="border-base-content/20 bg-base-100 py-0.25 fixed top-0 z-10 w-full border-b">
      <nav className="navbar mx-auto max-w-[1280px] rounded-b-xl px-4 sm:px-6 lg:px-8">
        <div className="w-full lg:flex lg:items-center lg:gap-2">
          <div className="navbar-start items-center justify-between max-lg:w-full">
            <Link className="text-base-content flex items-center gap-3 text-xl font-semibold" href="/home">
              <span className="text-primary">
        
              </span>
              ScanIt!
            </Link>
            <div className="flex items-center gap-5 lg:hidden">
              <button type="button" className="collapse-toggle btn btn-outline btn-secondary btn-square" data-collapse="#navbar-block-4" aria-controls="navbar-block-4" aria-label="Toggle navigation">
                <span className="icon-[tabler--menu-2] collapse-open:hidden size-5.5"></span>
                <span className="icon-[tabler--x] collapse-open:block size-5.5 hidden"></span>
              </button>
            </div>
          </div>
          <div id="navbar-block-4" className="lg:navbar-center transition-height collapse hidden grow overflow-hidden font-medium duration-300 lg:flex">
            <div className="text-base-content flex gap-6 text-base max-lg:mt-4 max-lg:flex-col lg:items-center">
              <Link href="/home" className="hover:text-primary nav-link">Home</Link>
              <Link href="/upload" className="hover:text-primary nav-link">Upload Picture</Link>
              <Link href="/inventory" className="hover:text-primary nav-link">Inventory</Link>
              <Link href="/recipe" className="hover:text-primary nav-link">Recipes</Link>
            </div>
          </div>
          <div className="navbar-end max-lg:hidden flex gap-4">
            <div ref={dropdownRef} className="relative">
  <div 
    tabIndex={0} 
    role="button" 
    className="btn btn-ghost btn-circle" 
    onClick={toggleDropdown}
  >
    <span className="icon-[tabler--user-circle] size-8"></span>
  </div>

  {/* Only render when open, fully absolute positioned */}
              {isDropdownOpen && (
                <div className="bg-base-100 rounded-box z-50 mt-3 w-80 p-4 shadow-lg absolute right-0 top-full">
                  {/* Profile Header Section */}
                  <div className="mb-4 px-2">
                    <h3 className="font-semibold text-lg mb-3">My Account</h3>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-base-200 ring ring-primary ring-offset-base-100 ring-offset-1">
                          <span className="icon-[tabler--user] size-6"></span>
                      </div>
                      <div>
                        <div className="font-bold text-lg">User Name</div>
                      </div>
                    </div>
                  </div>

                  <hr className="border-base-content/10 my-2" />

                  <ul className="menu menu-md p-0">
                    <li>
                      <Link href="/" onClick={closeDropdown} className="gap-3">
                        <span className="icon-[tabler--logout] size-5"></span>
                        Logout
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
