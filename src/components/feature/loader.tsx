'use client'

import { useState, useEffect } from 'react';

export default function AdminLoader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#0d1216]
        ${isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        transition-opacity duration-500`}
    >
      <div className="relative">
        {/* Main Content */}
        <div className="flex flex-col items-center">
          {/* Spinner */}
          <div className="relative w-24 h-24 mb-8">
            <svg
              className="absolute inset-0"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Background Circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="#594925"
                strokeWidth="2"
                className="opacity-20"
              />
              {/* Spinning Arc */}
              <path
                d="M50 5 A45 45 0 0 1 95 50"
                stroke="#ebae3a"
                strokeWidth="2"
                strokeLinecap="round"
                className="animate-spin origin-center"
                style={{ animationDuration: '1s' }}
              />
            </svg>

            {/* Admin Label */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-[#ebae3a]">
                ADMIN
              </span>
            </div>
          </div>

          {/* Loading Text */}
          <div className="text-center">
            <p className="text-[#ebae3a] text-sm animate-pulse">
              Memuat Panel Admin...
            </p>
          </div>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute -inset-10 -z-10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#ebae3a]/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#594925]/5 rounded-full blur-2xl"></div>
        </div>
      </div>
    </div>
  );
}