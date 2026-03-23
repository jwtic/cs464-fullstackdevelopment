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
                  Experience the Flavor
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
        {/* About us */}
        <section id="about-us">
          <div className="bg-base-200 py-8 sm:py-16 lg:py-24">
            <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col gap-12 md:gap-16 lg:gap-24">
                {/* Header section */}
                <div className="space-y-4 text-center">
                  <h2 className="text-base-content text-2xl font-semibold md:text-3xl lg:text-4xl">About Us</h2>
                  <p className="text-base-content/80 text-xl">Our achievement story stands as a powerful testament to teamwork and perseverance. United, we have faced challenges, celebrated victories, and woven a narrative of growth and success.</p>
                  <a href="#" className="btn btn-primary btn-lg btn-gradient">
                    Read More
                    <span className="icon-[tabler--arrow-right] size-5 rtl:rotate-180"></span>
                  </a>
                </div>
                {/* Video player and stats */}
                <div className="lg:h-161 relative mb-8 h-full w-full rounded-xl max-lg:space-y-6 sm:mb-16 lg:mb-24">
                  <img src="/assets/img/restaurant-about-us.png" alt="about-us" className="h-full w-full rounded-xl object-cover" />
                  {/* Stats card overlapping the video section */}
                  <div className="bg-base-100 border-base-content/20 rounded-box lg:-bottom-25 intersect:motion-preset-fade intersect:motion-opacity-0 intersect:motion-duration-800 grid gap-10 border px-10 py-8 sm:max-lg:grid-cols-2 lg:absolute lg:left-1/2 lg:w-3/4 lg:-translate-x-1/2 lg:grid-cols-4 xl:w-max">
                    {/* Stats items - Years of Experience */}
                    <div className="flex flex-col items-center justify-center gap-6">
                      {/* Document icon SVG */}
                      <svg xmlns="http://www.w3.org/2000/svg" width="43" height="42" viewBox="0 0 43 42" fill="none" className="text-primary">
                        <path d="M21.5 17.5C25.366 17.5 28.5 14.366 28.5 10.5C28.5 6.63401 25.366 3.5 21.5 3.5C17.634 3.5 14.5 6.63401 14.5 10.5C14.5 14.366 17.634 17.5 21.5 17.5Z" fill="currentColor" fillOpacity="0.5" />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M29.375 38.5C26.4877 38.5 25.0439 38.5 24.147 37.603C23.25 36.7061 23.25 35.2623 23.25 32.375C23.25 29.4877 23.25 28.0439 24.147 27.147C25.0439 26.25 26.4877 26.25 29.375 26.25C32.2623 26.25 33.7061 26.25 34.603 27.147C35.5 28.0439 35.5 29.4877 35.5 32.375C35.5 35.2623 35.5 36.7061 34.603 37.603C33.7061 38.5 32.2623 38.5 29.375 38.5ZM32.819 31.0552C33.2177 30.6565 33.2177 30.0102 32.819 29.6116C32.4204 29.2128 31.7741 29.2128 31.3754 29.6116L28.0139 32.973L27.3746 32.3337C26.9759 31.9351 26.3296 31.9351 25.931 32.3337C25.5323 32.7324 25.5323 33.3788 25.931 33.7774L27.292 35.1384C27.6906 35.5372 28.3371 35.5372 28.7357 35.1384L32.819 31.0552Z"
                          fill="currentColor"
                          fillOpacity="0.5" />
                        <path opacity="0.5" d="M32.1657 26.3046C31.4223 26.25 30.5102 26.25 29.375 26.25C26.4877 26.25 25.0439 26.25 24.1471 27.147C23.25 28.0439 23.25 29.4877 23.25 32.375C23.25 34.416 23.25 35.7357 23.5669 36.6508C22.8949 36.7161 22.2044 36.75 21.5 36.75C14.7345 36.75 9.25 33.6159 9.25 29.75C9.25 25.8841 14.7345 22.75 21.5 22.75C26.0735 22.75 30.0617 24.1822 32.1657 26.3046Z" fill="currentColor" fillOpacity="0.5" />
                      </svg>
                      <div className="space-y-2 text-center">
                        <span className="text-primary text-3xl font-semibold" id="count1"></span>
                        <p className="text-base-content/80">Years of Experience</p>
                      </div>
                    </div>
                    {/* Stats items - Dishes */}
                    <div className="flex flex-col items-center justify-center gap-6">
                      {/* Projects icon SVG */}
                      <svg xmlns="http://www.w3.org/2000/svg" width="43" height="42" viewBox="0 0 43 42" fill="none" className="text-primary">
                        <path
                          opacity="0.5"
                          d="M13.1788 3.5H29.8212C31.8493 3.5 32.8633 3.5 33.681 3.78457C35.2319 4.32418 36.4494 5.57758 36.9735 7.17405C37.25 8.01596 37.25 9.05984 37.25 11.1476V35.6549C37.25 37.1567 35.5262 37.9536 34.4358 36.9558C33.7951 36.3695 32.8299 36.3695 32.1892 36.9558L31.3438 37.7295C30.2209 38.7569 28.5291 38.7569 27.4062 37.7295C26.2834 36.702 24.5916 36.702 23.4688 37.7295C22.3459 38.7569 20.654 38.7569 19.5312 37.7295C18.4085 36.702 16.7165 36.702 15.5938 37.7295C14.471 38.7569 12.779 38.7569 11.6562 37.7295L10.8108 36.9558C10.1702 36.3695 9.2048 36.3695 8.56417 36.9558C7.47375 37.9536 5.75 37.1567 5.75 35.6549V11.1476C5.75 9.05984 5.75 8.01596 6.02641 7.17405C6.55059 5.57758 7.76814 4.32418 9.31893 3.78457C10.1367 3.5 11.1507 3.5 13.1788 3.5Z"
                          fill="currentColor"
                          fillOpacity="0.5" />
                        <path d="M12.75 11.8125C12.0251 11.8125 11.4375 12.4001 11.4375 13.125C11.4375 13.8499 12.0251 14.4375 12.75 14.4375H13.625C14.3499 14.4375 14.9375 13.8499 14.9375 13.125C14.9375 12.4001 14.3499 11.8125 13.625 11.8125H12.75Z" fill="currentColor" fillOpacity="0.5" />
                        <path d="M18.875 11.8125C18.1502 11.8125 17.5625 12.4001 17.5625 13.125C17.5625 13.8499 18.1502 14.4375 18.875 14.4375H30.25C30.9748 14.4375 31.5625 13.8499 31.5625 13.125C31.5625 12.4001 30.9748 11.8125 30.25 11.8125H18.875Z" fill="currentColor" fillOpacity="0.5" />
                        <path d="M12.75 17.9375C12.0251 17.9375 11.4375 18.5252 11.4375 19.25C11.4375 19.9748 12.0251 20.5625 12.75 20.5625H13.625C14.3499 20.5625 14.9375 19.9748 14.9375 19.25C14.9375 18.5252 14.3499 17.9375 13.625 17.9375H12.75Z" fill="currentColor" fillOpacity="0.5" />
                        <path d="M18.875 17.9375C18.1502 17.9375 17.5625 18.5252 17.5625 19.25C17.5625 19.9748 18.1502 20.5625 18.875 20.5625H30.25C30.9748 20.5625 31.5625 19.9748 31.5625 19.25C31.5625 18.5252 30.9748 17.9375 30.25 17.9375H18.875Z" fill="currentColor" fillOpacity="0.5" />
                        <path d="M12.75 24.0625C12.0251 24.0625 11.4375 24.6502 11.4375 25.375C11.4375 26.0998 12.0251 26.6875 12.75 26.6875H13.625C14.3499 26.6875 14.9375 26.0998 14.9375 25.375C14.9375 24.6502 14.3499 24.0625 13.625 24.0625H12.75Z" fill="currentColor" fillOpacity="0.5" />
                        <path d="M18.875 24.0625C18.1502 24.0625 17.5625 24.6502 17.5625 25.375C17.5625 26.0998 18.1502 26.6875 18.875 26.6875H30.25C30.9748 26.6875 31.5625 26.0998 31.5625 25.375C31.5625 24.6502 30.9748 24.0625 30.25 24.0625H18.875Z" fill="currentColor" fillOpacity="0.5" />
                      </svg>
                      <div className="space-y-2 text-center">
                        <span className="text-primary text-3xl font-semibold" id="count2"></span>
                        <p className="text-base-content/80">Dishes in Our Menu</p>
                      </div>
                    </div>
                    {/* Stats items - Customer Reviews */}
                    <div className="flex flex-col items-center justify-center gap-6">
                      {/* Star icon SVG */}
                      <svg xmlns="http://www.w3.org/2000/svg" width="43" height="42" viewBox="0 0 43 42" fill="none" className="text-primary">
                        <path
                          opacity="0.5"
                          d="M11.4549 37.4297H11C9.35008 37.4297 8.52513 37.4297 8.01256 36.9171C7.5 36.4046 7.5 35.5796 7.5 33.9297V31.9837C7.5 31.0763 7.5 30.6227 7.73307 30.2176C7.96613 29.8123 8.31772 29.6079 9.02093 29.1989C13.6505 26.5062 20.2251 24.9905 24.6134 27.6078C24.9081 27.7837 25.1734 27.996 25.3999 28.2504C26.3765 29.3475 26.3055 31.0032 25.1799 31.9856C24.9421 32.193 24.6888 32.3505 24.4337 32.4051C24.6433 32.3808 24.8442 32.353 25.036 32.3223C26.631 32.0679 27.9697 31.2156 29.1954 30.2897L32.358 27.9008C33.473 27.0585 35.1278 27.0583 36.2429 27.9003C37.2468 28.6584 37.5538 29.9065 36.9191 30.9237C36.179 32.1102 35.1362 33.628 34.1348 34.5553C33.1321 35.4841 31.6393 36.3132 30.4206 36.9014C29.0705 37.5531 27.5791 37.9285 26.0621 38.1742C22.9854 38.672 19.779 38.5961 16.7336 37.9687C15.0119 37.614 13.2239 37.4297 11.4549 37.4297Z"
                          fill="currentColor"
                          fillOpacity="0.5" />
                        <path
                          d="M19.5073 5.88586C20.3938 4.29529 20.8373 3.5 21.5 3.5C22.1627 3.5 22.6062 4.29529 23.4927 5.88586L23.7221 6.29736C23.9741 6.74935 24.1001 6.97534 24.2965 7.12446C24.493 7.27358 24.7377 7.32893 25.2268 7.43964L25.6723 7.54042C27.3942 7.92999 28.255 8.12478 28.4597 8.78341C28.6647 9.44205 28.0777 10.1284 26.904 11.5009L26.6002 11.8561C26.2666 12.2461 26.0999 12.4411 26.025 12.6824C25.9499 12.9237 25.9751 13.1839 26.0255 13.7043L26.0713 14.1781C26.2488 16.0094 26.3377 16.9251 25.8013 17.3322C25.2651 17.7392 24.4591 17.3681 22.847 16.6258L22.4299 16.4338C21.9718 16.2229 21.7427 16.1174 21.5 16.1174C21.2573 16.1174 21.0282 16.2229 20.57 16.4338L20.153 16.6258C18.5409 17.3681 17.7348 17.7392 17.1986 17.3322C16.6624 16.9251 16.7511 16.0094 16.9286 14.1781L16.9745 13.7043C17.0249 13.1839 17.0501 12.9237 16.9751 12.6824C16.9001 12.4411 16.7333 12.2461 16.3997 11.8561L16.0961 11.5009C14.9223 10.1284 14.3354 9.44205 14.5402 8.78341C14.745 8.12478 15.6059 7.92999 17.3277 7.54042L17.7731 7.43964C18.2623 7.32893 18.507 7.27358 18.7035 7.12446C18.8998 6.97534 19.0258 6.74935 19.2778 6.29736L19.5073 5.88586Z"
                          fill="currentColor"
                          fillOpacity="0.5" />
                        <path
                          d="M34.5035 13.4429C34.947 12.6476 35.1685 12.25 35.5 12.25C35.8314 12.25 36.053 12.6477 36.4964 13.4429L36.611 13.6487C36.737 13.8747 36.8 13.9877 36.8982 14.0622C36.9964 14.1368 37.1187 14.1645 37.3634 14.2198L37.5861 14.2702C38.447 14.465 38.8775 14.5624 38.9798 14.8917C39.0822 15.221 38.7889 15.5642 38.202 16.2505L38.0501 16.428C37.8833 16.6231 37.8 16.7206 37.7624 16.8412C37.7249 16.9618 37.7375 17.0919 37.7627 17.3521L37.7856 17.5891C37.8744 18.5047 37.9188 18.9625 37.6507 19.166C37.3826 19.3695 36.9796 19.184 36.1735 18.8128L35.9649 18.7169C35.7359 18.6114 35.6214 18.5587 35.5 18.5587C35.3785 18.5587 35.2641 18.6114 35.035 18.7169L34.8264 18.8128C34.0203 19.184 33.6173 19.3695 33.3492 19.166C33.0811 18.9625 33.1256 18.5047 33.2143 17.5891L33.2372 17.3521C33.2624 17.0919 33.275 16.9618 33.2376 16.8412C33.1999 16.7206 33.1166 16.6231 32.9499 16.428L32.798 16.2505C32.2112 15.5642 31.9177 15.221 32.0201 14.8917C32.1225 14.5624 32.553 14.465 33.4138 14.2702L33.6366 14.2198C33.8812 14.1645 34.0035 14.1368 34.1017 14.0622C34.1999 13.9877 34.2629 13.8747 34.3889 13.6487L34.5035 13.4429Z"
                          fill="currentColor"
                          fillOpacity="0.5" />
                        <path
                          d="M6.50361 13.4429C6.94694 12.6476 7.16861 12.25 7.50001 12.25C7.8314 12.25 8.05308 12.6477 8.4964 13.4429L8.6111 13.6487C8.73708 13.8747 8.80006 13.9877 8.89827 14.0622C8.99648 14.1368 9.11881 14.1645 9.36344 14.2198L9.58616 14.2702C10.4471 14.465 10.8775 14.5624 10.9799 14.8917C11.0823 15.221 10.7889 15.5642 10.202 16.2505L10.0501 16.428C9.88335 16.6231 9.79996 16.7206 9.76246 16.8412C9.72494 16.9618 9.73754 17.0919 9.76276 17.3521L9.78572 17.5891C9.87444 18.5047 9.91882 18.9625 9.6507 19.166C9.38259 19.3695 8.97958 19.184 8.17353 18.8128L7.96498 18.7169C7.73592 18.6114 7.6214 18.5587 7.50001 18.5587C7.37861 18.5587 7.26409 18.6114 7.03503 18.7169L6.82648 18.8128C6.02045 19.184 5.61743 19.3695 5.34931 19.166C5.08119 18.9625 5.12557 18.5047 5.2143 17.5891L5.23726 17.3521C5.26247 17.0919 5.27507 16.9618 5.23755 16.8412C5.20005 16.7206 5.11666 16.6231 4.94987 16.428L4.79804 16.2505C4.21114 15.5642 3.91769 15.221 4.0201 14.8917C4.12251 14.5624 4.55295 14.465 5.41385 14.2702L5.63657 14.2198C5.8812 14.1645 6.00353 14.1368 6.10174 14.0622C6.19995 13.9877 6.26295 13.8747 6.38891 13.6487L6.50361 13.4429Z"
                          fill="currentColor"
                          fillOpacity="0.5" />
                      </svg>
                      <div className="space-y-2 text-center">
                        <span className="text-primary text-3xl font-semibold" id="count3"></span>
                        <p className="text-base-content/80">Customer Reviews</p>
                      </div>
                    </div>
                    {/* Stats items - Happy Customer */}
                    <div className="flex flex-col items-center justify-center gap-6">
                      {/* Award icon SVG */}
                      <svg xmlns="http://www.w3.org/2000/svg" width="43" height="42" viewBox="0 0 43 42" fill="none" className="text-primary">
                        <path
                          d="M19.6207 4.13037C20.2392 4.50845 20.434 5.31631 20.056 5.93477C19.7816 6.38356 19.8503 6.96187 20.2222 7.33381L20.3935 7.5051C21.4238 8.53526 21.8035 10.0486 21.3819 11.4431C21.1723 12.137 20.4397 12.5295 19.7459 12.3197C19.052 12.11 18.6596 11.3775 18.8693 10.6836C19.0109 10.2153 18.8833 9.70716 18.5373 9.36126L18.3662 9.18997C17.1367 7.96056 16.9094 6.04903 17.8163 4.56561C18.1943 3.94714 19.0021 3.75228 19.6207 4.13037Z"
                          fill="currentColor"
                          fillOpacity="0.5" />
                        <path
                          d="M35.4549 12.3319C35.2125 12.4252 34.9978 12.6399 34.5685 13.0694C34.1391 13.4988 33.9244 13.7135 33.8309 13.9558C33.7217 14.2392 33.7217 14.5532 33.8309 14.8366C33.9244 15.0789 34.1391 15.2936 34.5685 15.723C34.9978 16.1524 35.2125 16.3671 35.4549 16.4605C35.7382 16.5697 36.0522 16.5697 36.3357 16.4605C36.5779 16.3671 36.7926 16.1524 37.2221 15.723C37.6515 15.2936 37.8662 15.0789 37.9595 14.8366C38.0687 14.5532 38.0687 14.2392 37.9595 13.9558C37.8662 13.7135 37.6515 13.4988 37.2221 13.0694C36.7926 12.6399 36.5779 12.4252 36.3357 12.3319C36.0522 12.2227 35.7382 12.2227 35.4549 12.3319Z"
                          fill="currentColor"
                          fillOpacity="0.5" />
                        <path
                          d="M37.9639 21.9793C37.3309 21.7026 36.5947 21.8188 36.0779 22.2771C34.6616 23.5329 32.6008 23.7417 30.9616 22.7953L30.589 22.5802C29.9613 22.2178 29.7462 21.4151 30.1087 20.7874C30.4711 20.1596 31.2738 19.9444 31.9015 20.307L32.2741 20.5219C32.9347 20.9034 33.7655 20.8192 34.3363 20.3131C35.6187 19.176 37.445 18.8876 39.0155 19.5741L39.5256 19.7972C40.1897 20.0875 40.4928 20.8614 40.2023 21.5255C39.912 22.1898 39.1381 22.4927 38.474 22.2024L37.9639 21.9793Z"
                          fill="currentColor"
                          fillOpacity="0.5" />
                        <path
                          opacity="0.7"
                          d="M24.2318 7.69384C24.5837 7.34198 24.7596 7.16605 24.9629 7.10157C25.1351 7.04704 25.3198 7.04704 25.4918 7.10157C25.6953 7.16605 25.8712 7.34198 26.2231 7.69384C26.5749 8.04567 26.7507 8.2216 26.8153 8.42502C26.8699 8.59708 26.8699 8.78179 26.8153 8.95384C26.7507 9.15726 26.5749 9.33318 26.2231 9.68502C25.8712 10.0369 25.6953 10.2128 25.4918 10.2773C25.3198 10.3318 25.1351 10.3318 24.9629 10.2773C24.7596 10.2128 24.5837 10.0369 24.2318 9.68504C23.88 9.33318 23.704 9.15726 23.6396 8.95384C23.585 8.78179 23.585 8.59708 23.6396 8.42502C23.704 8.2216 23.88 8.04567 24.2318 7.69384Z"
                          fill="currentColor"
                          fillOpacity="0.5" />
                        <path opacity="0.7" d="M33.8502 26.7984C34.2168 26.4318 34.8111 26.4318 35.1775 26.7984C35.5442 27.1649 35.5442 27.7592 35.1775 28.1258C34.8111 28.4924 34.2168 28.4924 33.8502 28.1258C33.4835 27.7592 33.4835 27.1649 33.8502 26.7984Z" fill="currentColor" fillOpacity="0.5" />
                        <g opacity="0.5">
                          <path d="M12.6216 6.89639C12.9882 6.52982 13.5825 6.52982 13.9491 6.89639C14.3157 7.26296 14.3157 7.8573 13.9491 8.22387C13.5825 8.59044 12.9882 8.59044 12.6216 8.22387C12.255 7.8573 12.255 7.26296 12.6216 6.89639Z" fill="currentColor" fillOpacity="0.5" />
                          <path
                            d="M31.4554 8.2628C32.1663 8.40497 32.6272 9.09643 32.4851 9.80723L32.2331 11.0671C31.8863 12.801 30.637 14.2162 28.9596 14.7754C28.1756 15.0367 27.592 15.6979 27.4299 16.5082L27.1779 17.768C27.0356 18.4789 26.3442 18.9398 25.6334 18.7976C24.9227 18.6555 24.4617 17.964 24.6038 17.2532L24.8558 15.9934C25.2025 14.2594 26.4518 12.8443 28.1294 12.2851C28.9132 12.0238 29.497 11.3625 29.6591 10.5523L29.9111 9.29241C30.0532 8.58161 30.7446 8.12065 31.4554 8.2628Z"
                            fill="currentColor"
                            fillOpacity="0.5" />
                        </g>
                        <path opacity="0.2" d="M31.1246 17.0477C31.491 16.6812 32.0855 16.6812 32.452 17.0477C32.8186 17.4143 32.8186 18.0087 32.452 18.3752C32.0855 18.7418 31.491 18.7418 31.1246 18.3752C30.758 18.0087 30.758 17.4143 31.1246 17.0477Z" fill="currentColor" fillOpacity="0.5" />
                        <path opacity="0.5" d="M7.52088 27.5831L10.4775 18.7133C11.818 14.6917 12.4883 12.6809 14.0742 12.3065C15.6602 11.9321 17.1589 13.4309 20.1565 16.4284L26.0697 22.3415C29.0671 25.3391 30.566 26.8378 30.1915 28.4238C29.8172 30.0097 27.8064 30.6799 23.7847 32.0206L14.9149 34.9772C10.0755 36.5904 7.65572 37.397 6.37843 36.1196C5.10114 34.8423 5.90771 32.4226 7.52088 27.5831Z" fill="currentColor" fillOpacity="0.5" />
                        <path
                          d="M15.9002 13.1324L15.9888 12.7036C15.3008 12.3 14.6942 12.1602 14.0744 12.3065C13.8216 12.3662 13.5921 12.4674 13.3794 12.6117L14.5982 12.8635C13.7607 12.6905 13.4762 12.6316 13.3794 12.6117C13.3591 12.6255 13.3387 12.6399 13.3186 12.6545L13.3094 12.7004C13.2967 12.7632 13.2785 12.8551 13.2555 12.9732C13.2095 13.2094 13.1446 13.551 13.0679 13.9766C12.9146 14.8271 12.7139 16.0157 12.5239 17.37C12.1474 20.0531 11.7987 23.4813 11.9783 26.2209C12.087 27.8785 12.4319 29.935 12.7397 31.5416C12.895 32.3526 13.0437 33.0633 13.1537 33.5716C13.2087 33.8259 13.2541 34.03 13.2858 34.1712L13.3228 34.3341L13.3327 34.3772L13.3361 34.3919C13.3361 34.392 13.3365 34.3933 14.6148 34.0958L13.3361 34.3919L13.5758 35.4221C14.0003 35.2821 14.4463 35.1333 14.915 34.9772L16.0773 34.5898L15.8904 33.7865L15.8815 33.7479L15.8467 33.5944C15.8164 33.4598 15.7726 33.2631 15.7193 33.0167C15.6127 32.5237 15.4684 31.8341 15.3178 31.0478C15.0137 29.4605 14.6952 27.5364 14.5977 26.0491C14.4366 23.5924 14.7513 20.3866 15.1234 17.7348C15.3077 16.4216 15.5025 15.2675 15.6513 14.4421C15.7256 14.0297 15.7883 13.7002 15.8322 13.4747C15.8541 13.3619 15.8713 13.2753 15.883 13.2173L15.8961 13.1523L15.8993 13.1366L15.9002 13.1324Z"
                          fill="currentColor"
                          fillOpacity="0.5" />
                        <path
                          d="M23.3193 32.176L20.8288 33.006L20.6671 32.5195L21.9128 32.1057C20.6671 32.5195 20.6673 32.5197 20.6671 32.5195L20.6656 32.5146L20.6621 32.5041L20.6496 32.466C20.639 32.4333 20.6237 32.3862 20.6047 32.326C20.5665 32.2054 20.5124 32.0323 20.448 31.8169C20.3192 31.3869 20.1477 30.7855 19.9759 30.0974C19.6397 28.7513 19.2734 26.9622 19.2734 25.4716C19.2734 23.9809 19.6397 22.1919 19.9759 20.8458C20.1477 20.1577 20.3192 19.5562 20.448 19.1263C20.5124 18.9108 20.5665 18.7378 20.6047 18.6172C20.6237 18.557 20.639 18.5099 20.6496 18.4772L20.6621 18.439L20.6656 18.4284L20.6666 18.4252C20.6666 18.4252 20.6671 18.4236 21.9128 18.8375L20.6666 18.4252L21.0376 17.309L23.1147 19.386C23.1122 19.3942 23.1094 19.4026 23.1066 19.4113C23.0723 19.5195 23.0226 19.6787 22.9628 19.8789C22.8427 20.28 22.6826 20.8416 22.5227 21.4818C22.1954 22.7922 21.8984 24.3203 21.8984 25.4716C21.8984 26.6229 22.1954 28.151 22.5227 29.4614C22.6826 30.1016 22.8427 30.6631 22.9628 31.0642C23.0226 31.2644 23.0723 31.4237 23.1066 31.5318C23.1238 31.5859 23.1371 31.6272 23.146 31.6542L23.1556 31.6841L23.1579 31.6907L23.3193 32.176Z"
                          fill="currentColor"
                          fillOpacity="0.5" />
                      </svg>
                      <div className="space-y-2 text-center">
                        <span className="text-primary text-3xl font-semibold" id="count4"></span>
                        <p className="text-base-content/80">Happy Customers</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Blog Component */}
        <section id="services">
          <div className="bg-base-100 py-8 sm:py-16 lg:py-24">
            <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
              {/* Section Header */}
              <div className="mb-12 space-y-4 text-center sm:mb-16 lg:mb-24">
                <h2 className="text-base-content text-2xl font-semibold md:text-3xl lg:text-4xl">Crafting Moments, Serving You</h2>
                <p className="text-base-content/80 text-xl">From unforgettable flavors to seamless service, we’re here to make every meal feel special. Whether you dine in, take out, or order online we’ve got your cravings covered.</p>
              </div>
              {/* Blog Grid */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Blog Card 1 */}
                <div className="card card-border shadow-none">
                  <figure>
                    <img src="/assets/img/free-blog-1.png" alt="Vegetable Market" />
                  </figure>
                  <div className="card-body gap-3">
                    <h5 className="card-title text-xl">Buffet Service</h5>
                    <p className="mb-5">Navigate effortlessly with our intuitive design, optimized for all devices. Enjoy a seamless experience whether you're on a computer or mobile device.</p>
                    <div className="card-actions">
                      <a href="#" className="btn btn-primary btn-gradient">
                        Read More
                        <span className="icon-[tabler--arrow-right] size-5 rtl:rotate-180"></span>
                      </a>
                    </div>
                  </div>
                </div>
                {/* Blog Card 2 */}
                <div className="card card-border shadow-none">
                  <figure>
                    <img src="/assets/img/free-blog-2.png" alt="Delivery Service" />
                  </figure>
                  <div className="card-body gap-3">
                    <h5 className="card-title text-xl">Food delivery</h5>
                    <p className="mb-5">Enjoy a safe shopping experience with multiple payment options and SSL encryption. Your personal and financial information is always protected.</p>
                    <div className="card-actions">
                      <a href="#" className="btn btn-primary btn-gradient">
                        Read More
                        <span className="icon-[tabler--arrow-right] size-5 rtl:rotate-180"></span>
                      </a>
                    </div>
                  </div>
                </div>
                {/* Blog Card 3 */}
                <div className="card card-border shadow-none">
                  <figure>
                    <img src="/assets/img/free-blog-3.png" alt="Cafeteria" />
                  </figure>
                  <div className="card-body gap-3">
                    <h5 className="card-title text-xl">Cafeteria</h5>
                    <p className="mb-5">Find products quickly with advanced filters, sorting options, and suggestion. Save time and effortlessly locate exactly what you need with ease.</p>
                    <div className="card-actions">
                      <a href="#" className="btn btn-primary btn-gradient">
                        Read More
                        <span className="icon-[tabler--arrow-right] size-5 rtl:rotate-180"></span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Customer Reviews */}
        <div className="bg-base-200 py-8 sm:py-16 lg:py-24">
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
            <div id="multi-slide" data-carousel='{ "loadingClasses": "opacity-0", "slidesQty": { "xs": 1, "md": 2 } }' className="relative flex w-full gap-12 max-lg:flex-col md:gap-16 lg:items-center lg:gap-24">
              <div>
                <div className="space-y-4">
                  <h2 className="text-base-content text-2xl font-semibold md:text-3xl lg:text-4xl">Customers Feedback</h2>
                  <p className="text-base-content/80 text-xl">From career changes to dream jobs, here's how FlyonUI helped.</p>
                  <div className="flex gap-4">
                    <button className="btn btn-square btn-sm carousel-prev btn-primary carousel-disabled:opacity-100 carousel-disabled:btn-outline relative hover:text-white" disabled>
                      <span className="icon-[tabler--arrow-left] size-5"></span>
                    </button>
                    <button className="btn btn-square btn-sm carousel-next btn-primary carousel-disabled:opacity-100 carousel-disabled:btn-outline relative hover:text-white">
                      <span className="icon-[tabler--arrow-right] size-5"></span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="carousel rounded-box">
                <div className="carousel-body gap-6 opacity-0">
                  {/* Slide 1 */}
                  <div className="carousel-slide">
                    <div className="card card-border hover:border-primary transition-border h-full shadow-none duration-300">
                      {/* Star Rating */}
                      <div className="card-body gap-5">
                        {/* User Info */}
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="size-10 rounded-full">
                              <img src="/assets/img/avatars/7.png" alt="Craig Bator" />
                            </div>
                          </div>
                          <div>
                            <h4 className="text-base-content font-medium">Craig Bator</h4>
                            <p className="text-base-content/80 text-sm">Food Blogger</p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <span className="icon-[tabler--star-filled] text-warning size-6 shrink-0"></span>
                          <span className="icon-[tabler--star-filled] text-warning size-6 shrink-0"></span>
                          <span className="icon-[tabler--star-filled] text-warning size-6 shrink-0"></span>
                          <span className="icon-[tabler--star-filled] text-warning size-6 shrink-0"></span>
                          <span className="icon-[tabler--star-filled] text-warning size-6 shrink-0"></span>
                        </div>
                        {/* Content */}
                        <p className="text-base-content/80">Chef Marilyn’s signature curry is hands-down the best I’ve ever had. The flavors are bold and unforgettable!”</p>
                      </div>
                    </div>
                  </div>
                  {/* Slide 2 */}
                  <div className="carousel-slide">
                    <div className="card card-border hover:border-primary transition-border h-full shadow-none duration-300">
                      {/* Star Rating */}
                      <div className="card-body gap-5">
                        {/* User Info */}
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="size-10 rounded-full">
                              <img src="/assets/img/avatars/2.png" alt="Craig Bator" />
                            </div>
                          </div>
                          <div>
                            <h4 className="text-base-content font-medium">Lindsey Saris</h4>
                            <p className="text-base-content/80 text-sm">Travel Chef Reviewer</p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <span className="icon-[tabler--star-filled] text-warning size-6 shrink-0"></span>
                          <span className="icon-[tabler--star-filled] text-warning size-6 shrink-0"></span>
                          <span className="icon-[tabler--star-filled] text-warning size-6 shrink-0"></span>
                          <span className="icon-[tabler--star-filled] text-warning size-6 shrink-0"></span>
                          <span className="icon-[tabler--star-half-filled] text-warning size-6 shrink-0"></span>
                        </div>
                        {/* Content */}
                        <p className="text-base-content/80">“Takahiro’s sushi is pure perfection. So fresh, delicate, and beautifully presented — a five-star experience.”</p>
                      </div>
                    </div>
                  </div>
                  {/* Slide 3 */}
                  <div className="carousel-slide">
                    <div className="card card-border hover:border-primary transition-border h-full shadow-none duration-300">
                      {/* Star Rating */}
                      <div className="card-body gap-5">
                        {/* User Info */}
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="size-10 rounded-full">
                              <img src="/assets/img/avatars/3.png" alt="Alexandra Lee" />
                            </div>
                          </div>
                          <div>
                            <h4 className="text-base-content font-medium">Alexandra Lee</h4>
                            <p className="text-base-content/80 text-sm">Master Chief Judge</p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <span className="icon-[tabler--star-filled] text-warning size-6 shrink-0"></span>
                          <span className="icon-[tabler--star-filled] text-warning size-6 shrink-0"></span>
                          <span className="icon-[tabler--star-filled] text-warning size-6 shrink-0"></span>
                          <span className="icon-[tabler--star-filled] text-warning size-6 shrink-0"></span>
                          <span className="icon-[tabler--star-filled] text-warning size-6 shrink-0"></span>
                        </div>
                        {/* Content */}
                        <p className="text-base-content/80">The ambiance is amazing, and the food is even better! The grilled salmon was perfectly cooked. A must-try place!</p>
                      </div>
                    </div>
                  </div>
                  {/* Slide 4 */}
                  <div className="carousel-slide">
                    <div className="card card-border hover:border-primary transition-border h-full shadow-none duration-300">
                      {/* Star Rating */}
                      <div className="card-body gap-5">
                        {/* User Info */}
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="size-10 rounded-full">
                              <img src="/assets/img/avatars/12.png" alt="Jason Wu" />
                            </div>
                          </div>
                          <div>
                            <h4 className="text-base-content font-medium">Jason Wu</h4>
                            <p className="text-base-content/80 text-sm">Food Blogger</p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <span className="icon-[tabler--star-filled] text-warning size-6 shrink-0"></span>
                          <span className="icon-[tabler--star-filled] text-warning size-6 shrink-0"></span>
                          <span className="icon-[tabler--star-filled] text-warning size-6 shrink-0"></span>
                          <span className="icon-[tabler--star-filled] text-warning size-6 shrink-0"></span>
                          <span className="icon-[tabler--star-filled] text-warning size-6 shrink-0"></span>
                        </div>
                        {/* Content */}
                        <p className="text-base-content/80">The service was exceptional. From the moment we walked in, the staff made us feel like family.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* CTA Section */}
        <div className="bg-base-100 py-8 sm:py-16 lg:py-24">
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
            <div className="from-primary/30 to-error/30 p-0.25 overflow-hidden rounded-3xl bg-gradient-to-r">
              <div className="bg-base-100 rounded-3xl p-0.5">
                <div className="from-primary/6 to-error/6 relative rounded-3xl bg-gradient-to-r to-50% p-8 lg:p-16">
                  <div className="flex justify-between gap-8 max-md:flex-col max-sm:items-center max-sm:text-center md:items-center">
                    <div className="max-w-xs space-y-4 lg:max-w-lg">
                      <h2 className="text-base-content text-xl font-bold md:text-3xl">Order Now & Satisfy Your Cravings</h2>
                      <p className="text-base-content/80">Let us bring the flavors you love straight to your door. From classic comfort dishes to chef-curated specials, every bite is made with care and delivered fresh. Skip the wait — your next favorite meal is just a click away.</p>
                      <a className="btn btn-gradient btn-primary" href="#">
                        Read More
                        <span className="icon-[tabler--arrow-right]"></span>
                      </a>
                    </div>
                    <img src="/assets/img/mint.png" alt="mint" className="intersect-once intersect:motion-preset-slide-down-lg intersect:motion-duration-800 intersect:motion-opacity-in-0 intersect:motion-delay-100 absolute end-[21%] top-0 h-20 max-w-sm max-md:hidden" />
                    <img src="/assets/img/pizza.png" alt="Pizza" className="rtl:rotate-y-180 absolute end-0 top-0 h-full max-w-md rounded-br-3xl max-md:hidden" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="via-primary/20 mx-auto h-px w-3/5 bg-gradient-to-r from-transparent to-transparent"></div>
        {/* Team */}
        <section id="team">
          <div className="bg-base-100 py-8 sm:py-16 lg:py-24">
            <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
              <div className="mb-12 text-center sm:mb-16 lg:mb-24">
                <h2 className="text-base-content mb-4 text-2xl font-semibold md:text-3xl lg:text-4xl">Get to Know Our Amazing Team</h2>
                <p className="text-base-content/80 text-xl">Meet the Passionate Experts Behind Our Success and Learn More About Their Roles .</p>
              </div>
              {/* Team Members */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* Team Member 1 */}
                <div className="card card-border hover:border-primary h-max shadow-none">
                  <figure className="bg-base-200 pt-10.5">
                    <img src="/assets/img/chef-1.png" alt="Cheyenne Workman" className="h-60 w-auto" />
                  </figure>
                  <div className="card-body gap-3 p-5">
                    <h3 className="text-base-content text-lg font-medium">Cheyenne Workman</h3>
                    <div className="divider"></div>
                    <div>
                      <p className="text-base-content/80 mb-1 font-medium">Head Chef</p>
                      <p className="text-base-content/80">A visionary leader driving innovation and collaboration.</p>
                    </div>
                  </div>
                </div>
                {/* Team Member 2 */}
                <div className="card card-border hover:border-primary h-max shadow-none">
                  <figure className="bg-base-200 pt-10.5">
                    <img src="/assets/img/chef-2.png" alt="Corey Rosser" className="h-60 w-auto" />
                  </figure>
                  <div className="card-body gap-3 p-5">
                    <h3 className="text-base-content text-lg font-medium">Corey Rosser</h3>
                    <div className="divider"></div>
                    <div>
                      <p className="text-base-content/80 mb-1 font-medium">Kitchen Manager</p>
                      <p className="text-base-content/80">Leading teams to build smart, scalable solutions.</p>
                    </div>
                  </div>
                </div>
                {/* Team Member 3 */}
                <div className="card card-border hover:border-primary h-max shadow-none">
                  <figure className="bg-base-200 pt-10.5">
                    <img src="/assets/img/chef-3.png" alt="Marilyn Westervelt" className="h-60 w-auto" />
                  </figure>
                  <div className="card-body gap-3 p-5">
                    <h3 className="text-base-content text-lg font-medium">Marilyn Westervelt</h3>
                    <div className="divider"></div>
                    <div>
                      <p className="text-base-content/80 mb-1 font-medium">Sous Chef</p>
                      <p className="text-base-content/80">Crafting intuitive and engaging user experiences.</p>
                    </div>
                  </div>
                </div>
                {/* Team Member 4 */}
                <div className="card card-border hover:border-primary h-max shadow-none">
                  <figure className="bg-base-200 pt-10.5">
                    <img src="/assets/img/chef-4.png" alt="Ryan Passaquindici Arcand" className="h-60 w-auto" />
                  </figure>
                  <div className="card-body gap-3 p-5">
                    <h3 className="text-base-content text-lg font-medium">Ryan Passaquindici Arcand</h3>
                    <div className="divider"></div>
                    <div>
                      <p className="text-base-content/80 mb-1 font-medium">Culinary Director</p>
                      <p className="text-base-content/80">Bringing designs to life with seamless interfaces.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Contact Us */}
        <section id="contact-us">
          <div className="bg-base-200 py-8 sm:py-16 lg:py-24">
            <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
              {/* Heading Section */}
              <div className="mb-12 text-center text-white sm:mb-16 lg:mb-24">
                <h2 className="text-base-content mb-4 text-2xl font-semibold md:text-3xl md:text-6xl lg:text-4xl">Get in Touch to Reserve Your Table</h2>
                <p className="text-base-content/80 text-xl">Whether you're planning a casual dinner or a special celebration, we're here to make your experience seamless.</p>
              </div>
              <div className="card shadow-md">
                <div className="card-body grid gap-10 lg:grid-cols-7">
                  {/* Form Section */}
                  <div className="lg:col-span-4">
                    <h2 className="text-base-content mb-6 text-3xl font-semibold">Book a Table</h2>
                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                      <div className="flex gap-6 max-md:flex-col">
                        <div className="w-full">
                          <label className="label-text" htmlFor="username">Your Name</label>
                          <div className="input input-lg">
                            <input type="text" className="grow" placeholder="Enter your name here..." id="username" />
                            <span className="icon-[tabler--user] text-base-content/80 size-5.5 my-auto ms-3 shrink-0"></span>
                          </div>
                        </div>
                        <div className="w-full">
                          <label className="label-text" htmlFor="userphone">Phone Number</label>
                          <div className="input input-lg">
                            <input type="text" className="grow" placeholder="+1 (212) 555-1234" id="userphone" />
                            <span className="icon-[tabler--phone] text-base-content/80 size-5.5 my-auto ms-3 shrink-0"></span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-6 max-md:flex-col">
                        <div className="w-full">
                          <label className="label-text" htmlFor="userdate">Enter The Date</label>
                          <div className="input input-lg">
                            <input type="text" className="flatpickr-date grow" placeholder="06/11/25" id="userdate" />
                            <span className="icon-[tabler--calendar-event] text-base-content/80 size-5.5 my-auto ms-3 shrink-0"></span>
                          </div>
                        </div>
                        <div className="w-full">
                          <label className="label-text" htmlFor="usertime">Enter Time</label>
                          <div className="input input-lg">
                            <input type="text" className="grow" placeholder="06:00:00" id="usertime" />
                            <span className="icon-[tabler--calendar-time] text-base-content/80 size-5.5 my-auto ms-3 shrink-0"></span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="label-text" htmlFor="usermessage">Message</label>
                        <div className="textarea">
                          <textarea className="grow resize-none" aria-label="Textarea" placeholder="Enter your message" id="usermessage"></textarea>
                          <span className="icon-[tabler--message-circle-2] text-base-content/80 mx-4 mt-2 size-6 shrink-0"></span>
                        </div>
                      </div>
                      <button type="submit" className="btn btn-primary btn-gradient w-full">Book a Reservation</button>
                    </form>
                  </div>
                  {/* Contact Information */}
                  <div className="space-y-6 lg:col-span-3">
                    <div className="border-base-content/20 rounded-box border p-6 text-center">
                      <h3 className="text-base-content mb-4 text-xl font-semibold">Email/Phone</h3>
                      <p className="text-base-content/80 mb-2 break-all">johndoe@gmail.com</p>
                      <p className="text-base-content/80">+148 589 2001 2466</p>
                    </div>
                    <div className="border-base-content/20 rounded-box border p-6 text-center">
                      <h3 className="text-base-content mb-4 text-xl font-semibold">Our Location</h3>
                      <p className="text-base-content/80">Office 149,</p>
                      <p className="text-base-content/80">450 South Brand Brooklyn</p>
                      <p className="text-base-content/80">San Diego County,</p>
                      <p className="text-base-content/80">CA 91905, USA</p>
                    </div>
                    <p className="text-base-content text-center font-medium">
                      Opening Hours
                      <span className="text-primary">9AM - 11PM</span>
                      Everyday
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* FAQ */}
       
      </main>

      <footer>
        <div className="mx-auto max-w-[1280px] px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          <div className="flex items-center justify-between gap-3 max-md:flex-col">
            <a href="index.html" className="text-base-content flex items-center gap-3 text-xl font-semibold">
              <span className="text-primary">
              </span>

        
            </a>
            <nav className="flex items-center gap-6">
              <a href="#about-us" className="link link-animated text-base-content/80 font-medium">About</a>
              <a href="#services" className="link link-animated text-base-content/80 font-medium">Services</a>
              <a href="#team" className="link link-animated text-base-content/80 font-medium">Team</a>
              <a href="#faq" className="link link-animated text-base-content/80 font-medium">FAQ</a>
            </nav>
            <div className="text-base-content flex h-5 gap-4">
              <a href="#!" rel="noopener noreferrer" aria-label="Discord">
                <span className="icon-[tabler--brand-discord] size-5"></span>
              </a>
              <a href="#!" rel="noopener noreferrer" aria-label="Twitter">
                <span className="icon-[tabler--brand-x] size-5"></span>
              </a>
             
            </div>
          </div>
        </div>

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
