"use client";

import Image from "next/image";
import Script from "next/script";

export default function Home() {
  return (
    <>
    {/* Layout wrapper */}
    {/* Content */}
    <div className="bg-base-100">
      
      <main>
        {/* Hero section */}
        <section id="home">
          <div className="gap-18 md:pt-45 lg:gap-35 lg:pt-47.5 flex h-full flex-col justify-between bg-[url('/assets/img/free-layer-blur.png')] bg-cover bg-center bg-no-repeat py-8 pt-40 sm:py-16 md:gap-24 lg:py-24">
            <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-6 justify-self-center px-4 text-center sm:px-6 lg:px-8">
              <div className="bg-base-200 border-base-content/20 w-fit rounded-full border px-3 py-1">
                <span> Serving Food Lovers Since 2016 ❤️</span>
              </div>
              <h1 className="text-base-content z-1 relative text-5xl font-bold leading-[1.15] max-md:text-2xl md:max-w-3xl">
                <span>
                  Savor Every Bite. Savor
                  <br />
                  Every Moment.
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" width="348" height="10" viewBox="0 0 348 10" fill="none" className="-z-1 left-25 absolute -bottom-1.5 max-lg:left-4 max-md:hidden">
                  <path d="M1.85645 8.23715C62.4821 3.49284 119.04 1.88864 180.031 1.88864C225.103 1.88864 275.146 1.32978 319.673 4.85546C328.6 5.24983 336.734 6.33887 346.695 7.60269" stroke="url(#paint0_linear_17052_181397)" strokeWidth="2" strokeLinecap="round" />
                  <defs>
                    <linearGradient id="paint0_linear_17052_181397" x1="29.7873" y1="1.85626" x2="45.2975" y2="69.7387" gradientUnits="userSpaceOnUse">
                      <stop stopColor="var(--color-primary)" />
                      <stop offset="1" stopColor="var(--color-primary-content)" />
                    </linearGradient>
                  </defs>
                </svg>
              </h1>
              <p className="text-base-content/80 max-w-3xl">Welcome to a dining experience where flavor, freshness, and hospitality come together. Whether it's your first visit or your hundredth, every plate is made to impress.</p>
              <div className="flex gap-4">
                <a href="/upload" className="btn btn-primary btn-gradient btn-lg">
                  Scan something
                  <span className="icon-[tabler--arrow-right] size-5 rtl:rotate-180"></span>
                </a>
                <a href="/inventory" className="btn btn-secondary btn-lg">
                  My Inventory
                  <span className="icon-[tabler--box] size-5"></span>
                </a>
              </div>
            </div>
            <img src="/assets/img/dishes-hero.png" alt="Dishes" className="min-h-67 w-full object-cover" />
          </div>
        </section>
      
       
      
    
        <div className="via-primary/20 mx-auto h-px w-3/5 bg-gradient-to-r from-transparent to-transparent"></div>
        {/* Team */}
        
        
        {/* FAQ */}
       
      </main>

      <footer>
      
        <div className="divider"></div>

        <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-base-content text-center text-base">
            &copy;2025
            <a href="index.html" className="text-primary">FlyonUI</a>
            ,
            <br className="md:hidden" />
            Made With  for better web • Distributed by <a href="https://themewagon.com" target="_blank" className="text-primary">ThemeWagon</a>
          </div>
        </div>
      </footer>
    </div>
    {/* / Content */}

    {/* Vendors JS */}
    <Script src="/assets/dist/libs/tailwindcss-intersect/dist/observer.min.js" strategy="afterInteractive" />
    <Script src="/assets/dist/libs/flatpickr/dist/flatpickr.js" strategy="afterInteractive" />

    {/* FlyonUI JS */}
    <Script src="/assets/dist/libs/flyonui/flyonui.js" strategy="afterInteractive" />

    {/* Theme Utils JS */}
    <Script src="/assets/dist/js/theme-utils.js" strategy="afterInteractive" />

    {/* Main JS */}
    <Script src="/assets/dist/js/main.js" strategy="afterInteractive" />

    {/* Page JS */}
    <Script src="/assets/dist/js/landing-page-free.js" strategy="afterInteractive" />

    <button id="scrollToTopBtn" className="btn btn-circle btn-soft btn-secondary/20 bottom-15 end-15 motion-preset-slide-right motion-duration-800 motion-delay-100 fixed absolute z-[3] hidden" aria-label="Circle Soft Icon Button"><span className="icon-[tabler--chevron-up] size-5 shrink-0"></span></button>
  
    </>
  );
}
