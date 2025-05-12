
import { Link } from "react-router-dom";
export const Cta = () => {
  return (
    <div className="flex min-h-96 w-full flex-col items-center justify-center gap-6 rounded-3xl bg-primary/20 p-6 py-24">
      <h3 className="max-w-4xl text-balance text-center text-3xl font-semibold !leading-[1.1] md:text-5xl lg:text-pretty lg:text-7xl">
        Ready To Grow Your Business With Us?
      </h3>
      <p className="max-w-xl text-center text-base md:text-lg">
        Lorem ipsum dolor sit amet consectetur adipiscing eli mattis sit
        phasellus mollis sit aliquam sit nullam.
      </p>
      <div className="flex items-center gap-4">
        <button className="rounded-full text-background">
          Get Started Now
        </button>
        <Link
          to="/login"
          className="rounded-full bg-transparent text-base font-medium"
        >
          Login
        </Link>
      </div>
    </div>
  );
};
