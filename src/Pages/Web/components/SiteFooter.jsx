import { Link } from "react-router-dom";
import {
  FaFacebookSquare,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";
import { Mail, Phone } from "@material-ui/icons";

// Helper function to replace Next.js cn utility
const cn = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

export function SiteFooter({ className }) {
  return (
    <footer className={cn(className, "bg-gray-50")}>
      <div className="container mx-auto px-6 pt-16 pb-8">
        <div className="grid gap-12 py-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-3 transition-transform hover:scale-105">
              <img
                src="/android-chrome-192x192.png"
                alt="My Social View"
                height={40}
                width={40}
                style={{ height: "40px", width: "40px" }}
                className="rounded-lg shadow-sm"
              />
              <span className="text-xl font-light tracking-wide">
                my <strong className="font-bold text-primary">social</strong> view
              </span>
            </Link>
            <p className="max-w-xs text-sm font-light leading-relaxed text-gray-600">
              See the latest and upcoming posts, stories and ans, and schedule
              content for your social media platforms.
            </p>
            <div className="flex gap-3">
              <Link to="" className="rounded-full bg-primary/10 p-2.5 text-primary transition-all hover:bg-primary hover:text-white">
                <FaFacebookSquare size={18} />
              </Link>
              <Link to="" className="rounded-full bg-primary/10 p-2.5 text-primary transition-all hover:bg-primary hover:text-white">
                <FaInstagram size={18} />
              </Link>
              <Link to="" className="rounded-full bg-primary/10 p-2.5 text-primary transition-all hover:bg-primary hover:text-white">
                <FaLinkedin size={18} />
              </Link>
              <Link to="" className="rounded-full bg-primary/10 p-2.5 text-primary transition-all hover:bg-primary hover:text-white">
                <FaTwitter size={18} />
              </Link>
            </div>
          </div>

          {/* About Us Section */}
          <div>
            <p className="mb-6 text-lg font-medium text-gray-800 after:mt-2 after:block after:h-1 after:w-10 after:rounded-full after:bg-primary/70">About us</p>
            <ul className="space-y-4 font-light">
              <li>
                <a href="" className="text-gray-600 transition-colors hover:text-primary">
                  Mission
                </a>
              </li>
              <li>
                <a href="" className="text-gray-600 transition-colors hover:text-primary">
                  Our team
                </a>
              </li>
              <li>
                <a href="" className="text-gray-600 transition-colors hover:text-primary">
                  Awards
                </a>
              </li>
              <li>
                <a href="" className="text-gray-600 transition-colors hover:text-primary">
                  Testimonials
                </a>
              </li>
            </ul>
          </div>

          {/* Useful Links Section */}
          <div>
            <p className="mb-6 text-lg font-medium text-gray-800 after:mt-2 after:block after:h-1 after:w-10 after:rounded-full after:bg-primary/70">Useful Links</p>
            <ul className="space-y-4 font-light">
              <li>
                <a href="" className="text-gray-600 transition-colors hover:text-primary">
                  Help center
                </a>
              </li>
              <li>
                <a href="" className="text-gray-600 transition-colors hover:text-primary">
                  Terms and conditions
                </a>
              </li>
              <li>
                <a href="" className="text-gray-600 transition-colors hover:text-primary">
                  Privacy policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <p className="mb-6 text-lg font-medium text-gray-800 after:mt-2 after:block after:h-1 after:w-10 after:rounded-full after:bg-primary/70">Contact</p>
            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2.5 text-primary">
                  <Mail fontSize="small" />
                </div>
                <div>
                  <p className="text-xs font-light text-gray-500">Email:</p>
                  <a href="mailto:contact@mysocialview.com" className="text-sm font-medium hover:text-primary">contact@mysocialview.com</a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2.5 text-primary">
                  <Phone fontSize="small" />
                </div>
                <div>
                  <p className="text-xs font-light text-gray-500">Phone:</p>
                  <a href="tel:+14146875892" className="text-sm font-medium hover:text-primary">(414) 687 - 5892</a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-12 border-t border-gray-200">
          <p className="py-6 text-center text-sm font-light text-gray-600">
            Copyright © {new Date().getFullYear()} my <b className="font-bold text-primary">social</b> view | All
            Rights Reserved | <a href="" className="underline-offset-2 hover:text-primary hover:underline"> Terms and Conditions</a> |{" "}
            <a href="" className="underline-offset-2 hover:text-primary hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
