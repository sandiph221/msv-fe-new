import { ArrowRight } from "@mui/icons-material";
import { Link } from "react-router-dom";


export const Pricing = () => {
  return (
    <div className="space-y-12 py-32 md:py-52">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4">
        <Link
          to="/login"
          className="inline-flex items-center justify-center rounded-full border border-input bg-background px-4 py-2 text-base font-normal hover:bg-accent hover:text-accent-foreground"
        >
          View Subscription Details <ArrowRight className="ml-4 size-4" />
        </Link>
        <div className="text-center">
          <h3 className="max-w-4xl text-balance text-2xl font-medium !leading-[1.3] md:text-4xl lg:text-pretty lg:text-5xl">
            Friendly Pricing Plans
          </h3>
          <p className="max-w-lg text-base md:max-w-full md:text-lg">
            Lorem ipsum dolor sit amet consectetur adipiscing eli mattis sit
            phasellus mollis sit aliquam sit nullam.
          </p>
        </div>
      </div>
      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        <div className="flex w-full flex-col items-center md:items-start">
          <p className="text-sm font-semibold">Lite Plan</p>
          <p className="text-2xl font-medium md:text-4xl">
            $19<span className="text-sm text-muted-foreground">/month</span>
          </p>
          <p className="mt-4 max-w-sm text-sm font-light md:max-w-full md:text-base">
            Lorem ipsum dolor sit amet consectetur adipiscing eli mattis sit
            phasellus mollis sit aliquam sit nullam.
          </p>
          <Link
            to="/trial"
            className="mt-6 w-full max-w-lg rounded-full border border-primary/30 bg-primary/40 px-4 py-2 text-center hover:bg-primary/50 md:max-w-full"
          >
            Start a Free Trial <ArrowRight className="ml-4 size-4" />
          </Link>
        </div>
        <div className="flex w-full flex-col items-center md:items-start">
          <p className="text-sm font-semibold">Pro Plan</p>
          <p className="text-2xl font-medium md:text-4xl">
            $49 <span className="text-sm text-muted-foreground">/month</span>
          </p>
          <p className="mt-4 max-w-sm text-sm font-light md:max-w-full md:text-base">
            Lorem ipsum dolor sit amet consectetur adipiscing eli mattis sit
            phasellus mollis sit aliquam sit nullam.
          </p>
          <Link
            to="/trial"
            className="mt-6 w-full max-w-lg rounded-full bg-primary px-4 py-2 text-center text-background hover:bg-primary/90 md:max-w-full"
          >
            Start a Free Trial <ArrowRight className="ml-4 size-4" />
          </Link>
        </div>
        <div className="flex w-full flex-col items-center md:items-start">
          <p className="text-sm font-semibold">Plus Plan</p>
          <p className="text-2xl font-medium md:text-4xl">
            $99<span className="text-sm text-muted-foreground">/month</span>
          </p>
          <p className="mt-4 max-w-sm text-sm font-light md:max-w-full md:text-base">
            Lorem ipsum dolor sit amet consectetur adipiscing eli mattis sit
            phasellus mollis sit aliquam sit nullam.
          </p>
          <Link
            to="/trial"
            className="mt-6 w-full max-w-lg rounded-full border border-primary/30 bg-primary/40 px-4 py-2 text-center hover:bg-primary/50 md:max-w-full"
          >
            Start a Free Trial <ArrowRight className="ml-4 size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
