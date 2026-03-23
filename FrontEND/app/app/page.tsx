"use client";

import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="card w-full max-w-sm bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex flex-col items-center gap-2 mb-6">
            <span className="text-primary">
              <svg width="48" height="48" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_login)">
                  <mask id="mask0_login" style={{maskType: "luminance"}} maskUnits="userSpaceOnUse" x="0" y="0" width="34" height="34">
                    <path d="M25.5 0H8.5C3.80558 0 0 3.80558 0 8.5V25.5C0 30.1944 3.80558 34 8.5 34H25.5C30.1944 34 34 30.1944 34 25.5V8.5C34 3.80558 30.1944 0 25.5 0Z" fill="white" />
                  </mask>
                  <g mask="url(#mask0_login)">
                    <path d="M25.5 0H8.5C3.80558 0 0 3.80558 0 8.5V25.5C0 30.1944 3.80558 34 8.5 34H25.5C30.1944 34 34 30.1944 34 25.5V8.5C34 3.80558 30.1944 0 25.5 0Z" fill="url(#paint0_linear_login)" />
                    <path
                      d="M16.1238 20.1522C16.511 19.662 17.2479 19.6428 17.66 20.1122L20.5526 23.41C21.1194 24.0563 20.6611 25.0689 19.8016 25.0692H14.3055C13.47 25.0692 13.0026 24.1059 13.5203 23.4501L16.1238 20.1522ZM16.1326 8.45497C16.5308 7.95801 17.286 7.95453 17.6883 8.44813L27.5164 20.5077C28.0488 21.161 27.5838 22.1395 26.741 22.1395H24.4442C24.1428 22.1395 23.8577 22.0034 23.6678 21.7694L17.7029 14.4188C17.2962 13.9175 16.5285 13.927 16.1346 14.4384L10.7303 21.454C10.5411 21.6996 10.2484 21.8435 9.9383 21.8436H7.4881C6.64925 21.8436 6.18332 20.8733 6.70783 20.2186L16.1326 8.45497Z"
                      fill="url(#paint1_linear_login)" />
                  </g>
                  <path d="M25.5002 0.707886H8.50017C4.19695 0.707886 0.708496 4.19634 0.708496 8.49956V25.4996C0.708496 29.8028 4.19695 33.2912 8.50017 33.2912H25.5002C29.8034 33.2912 33.2918 29.8028 33.2918 25.4996V8.49956C33.2918 4.19634 29.8034 0.707886 25.5002 0.707886Z" stroke="url(#paint2_linear_login)" strokeWidth="2" />
                </g>
                <defs>
                  <linearGradient id="paint0_linear_login" x1="30.2812" y1="2.65625" x2="4.25" y2="32.4063" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="currentColor" />
                    <stop offset="1" stopColor="currentColor" />
                  </linearGradient>
                  <linearGradient id="paint1_linear_login" x1="17.1147" y1="8.08008" x2="17.1147" y2="25.0692" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="white" />
                    <stop offset="1" stopColor="white" stopOpacity="0.6" />
                  </linearGradient>
                  <linearGradient id="paint2_linear_login" x1="17.0002" y1="-0.000447931" x2="17.0002" y2="33.9996" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="white" stopOpacity="0.28" />
                    <stop offset="1" stopColor="white" stopOpacity="0.04" />
                  </linearGradient>
                  <clipPath id="clip0_login">
                    <rect width="34" height="34" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </span>
            <h2 className="text-2xl font-bold">Login</h2>
          </div>

          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input 
                type="email" 
                placeholder="email@example.com" 
                className="input input-bordered w-full" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-control w-full mt-4">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input 
                type="password" 
                placeholder="Enter your password" 
                className="input input-bordered w-full" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label className="label">
                <a href="#" className="label-text-alt link link-hover text-primary">Forgot password?</a>
              </label>
            </div>

            <div className="form-control mt-6">
              <Link href="/home" className="btn btn-primary w-full">
                Sign In
              </Link>
            </div>
          </form>
          
          <div className="text-center mt-4">
             <span className="text-sm">Don't have an account? </span>
             <Link href="/home" className="link link-primary text-sm">Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
