import React from "react";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

function TopNavbar() {
  return (
    <div>
      {" "}
      <div className="topNavbar flex justify-between items-center px-8 border-1 border-gray-300">
        <div className="w-1/2 px-6">
          <Link href="/" className={`flex items-center gap-3`}>
            {/* Icon */}
            <i
              className={`ri-snowflake-line  transition-colors duration-300 text-4xl text-blue-600`}
            ></i>

            {/* Text */}
            <div className="flex flex-col">
              <h1
                className={`font-bold transition-colors duration-300 text-xl/tight`}
              >
                Freeze Logistics
              </h1>
              <span className="text-gray-500 text-xs/tight">
                Customer Portal
              </span>
            </div>
          </Link>
        </div>
        <div className="w-1/2 py-4 px-6 ">
          <div className="flex justify-end items-center gap-4">
            <span className="text-gray-500 text-xs/tight text-end">
              Welcome, John Smith
            </span>
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopNavbar;
