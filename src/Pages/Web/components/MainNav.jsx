/* eslint-disable @next/next/no-img-element */
import { Link, useLocation } from "react-router-dom";
import * as React from "react";

import { MobileNav } from "./MobileNav";
import { Icons } from "./Icons";

import { Button, buttonVariants } from "../ui";

// Helper function to replace Next.js cn utility
const cn = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

export function MainNav({ items, children }) {
  const location = useLocation();
  const segment = location.pathname.split("/")[1] || "";
  const [showMobileMenu, setShowMobileMenu] = React.useState(false);

  return (
    <div className="flex w-full flex-row-reverse justify-between gap-6 lg:flex-row lg:gap-10">
      <Link
        to="/"
        className="hidden w-full items-center space-x-2 lg:flex lg:max-w-xs"
      >
        <img
          src="/android-chrome-192x192.png"
          alt="My Social View"
          height={32}
          width={32}
          style={{ height: "32px", width: "32px" }}
        />
        <span className="hidden text-xl lowercase text-primary sm:inline-block">
          my <strong>social</strong> view
        </span>
      </Link>
      {items?.length ? (
        <nav className="hidden gap-8 lg:flex">
          {items?.map((item, index) => (
            <Link
              key={index}
              to={item.disabled ? "#" : item.href}
              className={cn(
                "flex items-center text-lg transition-colors hover:text-foreground/80 sm:text-base",
                item.href === `/${segment}`
                  ? "text-primary"
                  : "text-foreground",
                item.disabled && "cursor-not-allowed opacity-80"
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>
      ) : null}
      <div className="flex items-center gap-4">
        <Button size={"lg"} className="rounded-full text-background">
          Get Started Now
        </Button>
        <Link
          to="/login"
          className={cn(
            buttonVariants({ size: "lg", variant: "outline" }),
            "rounded-full text-base font-medium"
          )}
        >
          Login
        </Link>
      </div>
      <button
        className="flex items-center space-x-2 lg:hidden"
        onClick={() => setShowMobileMenu(!showMobileMenu)}
      >
        {showMobileMenu ? <Icons.close /> : <Icons.menu />}
        <span className="font-bold">Menu</span>
      </button>
      {showMobileMenu && items && (
        <MobileNav setOpen={setShowMobileMenu} items={items}>
          {children}
        </MobileNav>
      )}
    </div>
  );
}
