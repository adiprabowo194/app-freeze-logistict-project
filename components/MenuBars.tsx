"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

function MenuBars() {
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 🔥 indicator state
  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    width: 0,
  });

  // 🔥 FIX TYPE
  const menuRefs = useRef<Array<HTMLLIElement | null>>([]);

  const menus = [
    { name: "Dashboard", href: "/dashboard", icon: "ri-home-9-line" },
    {
      name: "Quotes",
      icon: "ri-file-list-2-line",
      children: [
        { name: "Quick Quote", href: "/quote/quick-quote" },
        { name: "Saved Quotes", href: "/quotes/entry" },
      ],
    },
    {
      name: "Jobs",
      icon: "ri-box-3-line",
      children: [
        { name: "All Jobs", href: "/jobs" },
        { name: "Booking Jobs", href: "/jobs/booking" },
        { name: "Delivered Jobs", href: "/jobs/delivered" },
      ],
    },
    { name: "Invoices", href: "/invoices", icon: "ri-price-tag-3-line" },
    {
      name: "Profile",
      icon: "ri-account-circle-line",
      children: [
        { name: "Profile", href: "/profile" },
        { name: "Change Password", href: "/profile/change-password" },
      ],
    },
  ];

  // 🔥 hover handler
  const handleEnter = (name: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(name);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpen(null);
    }, 150);
  };

  // 🔥 UPDATE INDICATOR
  useEffect(() => {
    menus.forEach((menu, index) => {
      const isActive =
        menu.href === "/"
          ? pathname === "/"
          : menu.href && pathname.startsWith(menu.href);

      const isChildActive =
        menu.children && menu.children.some((c) => pathname.startsWith(c.href));

      if (isActive || isChildActive) {
        const el = menuRefs.current[index];
        if (el) {
          setIndicatorStyle({
            left: el.offsetLeft,
            width: el.offsetWidth,
          });
        }
      }
    });
  }, [pathname]);

  return (
    <div className="relative menuBar flex items-center px-8 border-b border-blue-400 bg-blue-600 text-white shadow-sm">
      <ul className="relative text-sm px-8 flex items-center gap-4">
        {/* 🔥 SLIDING INDICATOR */}
        <span
          className="absolute bottom-0 h-[3px] bg-yellow-300 transition-all duration-300 ease-in-out rounded-full"
          style={{
            left: indicatorStyle.left,
            width: indicatorStyle.width,
          }}
        />

        {menus.map((menu, index) => {
          const isActive =
            menu.href === "/"
              ? pathname === "/"
              : menu.href && pathname.startsWith(menu.href);

          const isChildActive =
            menu.children &&
            menu.children.some((c) => pathname.startsWith(c.href));

          // 🔥 MENU WITH CHILDREN
          if (menu.children) {
            return (
              <li
                key={menu.name}
                ref={(el) => {
                  menuRefs.current[index] = el; // ✅ FIX DI SINI
                }}
                className="relative"
                onMouseEnter={() => handleEnter(menu.name)}
                onMouseLeave={handleLeave}
              >
                <div
                  className={`flex gap-2 px-4 py-3 w-[180px] justify-center items-center font-semibold cursor-pointer transition-all
                  ${
                    isChildActive ? "text-yellow-300" : "hover:text-yellow-300"
                  }`}
                >
                  <i className={`${menu.icon} text-base`}></i>
                  {menu.name}
                  <i className="ri-arrow-down-s-line text-lg"></i>
                </div>

                {/* DROPDOWN */}
                {open === menu.name && (
                  <div className="absolute top-full left-0 w-[260px] bg-white text-gray-700 rounded-xl shadow-xl border z-50">
                    <div className="h-2 bg-transparent"></div>

                    <div className="overflow-hidden rounded-xl">
                      {menu.children.map((child) => {
                        const activeChild = pathname === child.href;

                        return (
                          <div
                            key={child.name}
                            onClick={() => router.push(child.href)}
                            className={`px-6 py-4 text-sm cursor-pointer transition-all flex justify-between
                              ${
                                activeChild
                                  ? "bg-blue-600 text-yellow-200 font-semibold"
                                  : "bg-gray-100 hover:bg-blue-500 hover:text-white"
                              }`}
                          >
                            {child.name}
                            {activeChild && (
                              <span className="w-2 h-2 bg-white rounded-full"></span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </li>
            );
          }

          // 🔥 MENU WITHOUT CHILDREN
          return (
            <li
              key={menu.name}
              ref={(el) => {
                menuRefs.current[index] = el; // ✅ FIX DI SINI JUGA
              }}
            >
              <Link
                href={menu.href!}
                className={`flex gap-2 px-4 py-3 w-[160px] justify-center items-center font-semibold transition-all
                  ${isActive ? "text-yellow-300" : "hover:text-yellow-300"}`}
              >
                <i className={`${menu.icon} text-base`}></i>
                {menu.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default MenuBars;
