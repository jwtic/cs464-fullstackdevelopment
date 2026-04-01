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

  const dropdownRef = useRef(null);
  useEffect(() => {
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
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
                <svg width="32" height="32" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_18078_104881)">
                    <mask id="mask0_18078_104881" style={{maskType: "luminance"}} maskUnits="userSpaceOnUse" x="0" y="0" width="34" height="34">
                      <path d="M25.5 0H8.5C3.80558 0 0 3.80558 0 8.5V25.5C0 30.1944 3.80558 34 8.5 34H25.5C30.1944 34 34 30.1944 34 25.5V8.5C34 3.80558 30.1944 0 25.5 0Z" fill="white" />
                    </mask>
                    <g mask="url(#mask0_18078_104881)">
                      <path d="M25.5 0H8.5C3.80558 0 0 3.80558 0 8.5V25.5C0 30.1944 3.80558 34 8.5 34H25.5C30.1944 34 34 30.1944 34 25.5V8.5C34 3.80558 30.1944 0 25.5 0Z" fill="url(#paint0_linear_18078_104881)" />
                      <path
                        d="M16.1238 20.1522C16.511 19.662 17.2479 19.6428 17.66 20.1122L20.5526 23.41C21.1194 24.0563 20.6611 25.0689 19.8016 25.0692H14.3055C13.47 25.0692 13.0026 24.1059 13.5203 23.4501L16.1238 20.1522ZM16.1326 8.45497C16.5308 7.95801 17.286 7.95453 17.6883 8.44813L27.5164 20.5077C28.0488 21.161 27.5838 22.1395 26.741 22.1395H24.4442C24.1428 22.1395 23.8577 22.0034 23.6678 21.7694L17.7029 14.4188C17.2962 13.9175 16.5285 13.927 16.1346 14.4384L10.7303 21.454C10.5411 21.6996 10.2484 21.8435 9.9383 21.8436H7.4881C6.64925 21.8436 6.18332 20.8733 6.70783 20.2186L16.1326 8.45497Z"
                        fill="url(#paint1_linear_18078_104881)" />
                    </g>
                    <path d="M25.5002 0.707886H8.50017C4.19695 0.707886 0.708496 4.19634 0.708496 8.49956V25.4996C0.708496 29.8028 4.19695 33.2912 8.50017 33.2912H25.5002C29.8034 33.2912 33.2918 29.8028 33.2918 25.4996V8.49956C33.2918 4.19634 29.8034 0.707886 25.5002 0.707886Z" stroke="url(#paint2_linear_18078_104881)" strokeWidth="2" />
                  </g>
                  <defs>
                    <linearGradient id="paint0_linear_18078_104881" x1="30.2812" y1="2.65625" x2="4.25" y2="32.4063" gradientUnits="userSpaceOnUse">
                      <stop offset="0" stopColor="currentColor" />
                      <stop offset="1" stopColor="currentColor" />
                    </linearGradient>
                    <linearGradient id="paint1_linear_18078_104881" x1="17.1147" y1="8.08008" x2="17.1147" y2="25.0692" gradientUnits="userSpaceOnUse">
                      <stop offset="0" stopColor="white" />
                      <stop offset="1" stopColor="white" stopOpacity="0.6" />
                    </linearGradient>
                    <linearGradient id="paint2_linear_18078_104881" x1="17.0002" y1="-0.000447931" x2="17.0002" y2="33.9996" gradientUnits="userSpaceOnUse">
                      <stop offset="0" stopColor="white" stopOpacity="0.28" />
                      <stop offset="1" stopColor="white" stopOpacity="0.04" />
                    </linearGradient>
                    <clipPath id="clip0_18078_104881">
                      <rect width="34" height="34" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </span>
              Restaurant
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
