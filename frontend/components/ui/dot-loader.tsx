"use client";

import React from "react";

export function DotLoader({ className = "" }: { className?: string }) {
  return (
    <div className={`dots-container ${className}`}>
      <style>{`
        .dots-container {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          width: 100%;
        }

        .dot {
          height: 16px;
          width: 16px;
          margin-right: 8px;
          border-radius: 50%;
          background-color: #b3d4fc;
          animation: pulse 1.5s infinite ease-in-out;
        }

        .dot:last-child {
          margin-right: 0;
        }

        .dot:nth-child(1) {
          animation-delay: -0.4s;
        }

        .dot:nth-child(2) {
          animation-delay: -0.2s;
        }

        .dot:nth-child(3) {
          animation-delay: 0s;
        }

        .dot:nth-child(4) {
          animation-delay: 0.2s;
        }

        .dot:nth-child(5) {
          animation-delay: 0.4s;
        }

        @keyframes pulse {
          0% {
            transform: scale(0.8);
            background-color: #b3d4fc;
            box-shadow: 0 0 0 0 rgba(178, 212, 252, 0.7);
          }

          50% {
            transform: scale(1.2);
            background-color: #6793fb;
            box-shadow: 0 0 0 8px rgba(178, 212, 252, 0);
          }

          100% {
            transform: scale(0.8);
            background-color: #b3d4fc;
            box-shadow: 0 0 0 0 rgba(178, 212, 252, 0.7);
          }
        }
      `}</style>
      <div className="dot" />
      <div className="dot" />
      <div className="dot" />
      <div className="dot" />
      <div className="dot" />
    </div>
  );
}

export default DotLoader;
