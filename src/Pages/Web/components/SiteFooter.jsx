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
    <footer className={cn(className, "container pt-32")}>
      <div className="grid gap-16 py-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <div className="space-y-4">
          <Link to="/" className="flex w-full max-w-xs items-center space-x-2">
            <img
              src="/android-chrome-192x192.png"
              alt="My Social View"
              height={32}
              width={32}
              style={{ height: "32px", width: "32px" }}
            />
            <span className="text-xl lowercase">
              my <strong>social</strong> view
            </span>
          </Link>
          <p className="max-w-xs font-light leading-none">
            See the latest and upcoming posts, stories and ans, and schedule
            content
          </p>
          <div className="flex gap-2 text-primary">
            <Link to="" className="rounded bg-primary/20 p-2">
              <FaFacebookSquare />
            </Link>
            <Link to="" className="rounded bg-primary/20 p-2">
              <FaInstagram />
            </Link>
            <Link to="" className="rounded bg-primary/20 p-2">
              <FaLinkedin />
            </Link>
            <Link to="" className="rounded bg-primary/20 p-2">
              <FaTwitter />
            </Link>
          </div>
        </div>
        <div>
          <p className="mb-6 font-medium">About us</p>
          <ul className="space-y-4 font-light">
            <li>
              <a href="" className="">
                Mission
              </a>
            </li>
            <li>
              <a href="" className="">
                Our team
              </a>
            </li>
            <li>
              <a href="" className="">
                Awards
              </a>
            </li>
            <li>
              <a href="" className="">
                Testimonials
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="mb-6 font-medium">Useful Links</p>
          <ul className="space-y-4 font-light">
            <li>
              <a href="" className="">
                Help center
              </a>
            </li>
            <li>
              <a href="" className="">
                Terms and conditions
              </a>
            </li>
            <li>
              <a href="" className="">
                Privacy policy
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="mb-6 font-medium">Contact</p>
          <ul className="space-y-4">
            <li className="flex gap-4 ">
              <Mail className="text-primary" />
              <div>
                <p className="text-sm font-light">Email:</p>
                <p className="text-medium">contact@mysocialview.com</p>
              </div>
            </li>
            <li className="flex gap-4 ">
              <Phone className="text-primary" />
              <div>
                <p className="text-sm font-light">Phone:</p>
                <p className="text-medium">(414) 687 - 5892</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <p className="border-t py-4 text-center font-light leading-loose text-muted-foreground">
        Copyright © 2025. my <b className="font-bold">social</b> view | All
        Rights Reserved | <a href=""> Terms and Conditions</a> |{" "}
        <a href="">Privacy Policy</a>
      </p>
    </footer>
  );
}
