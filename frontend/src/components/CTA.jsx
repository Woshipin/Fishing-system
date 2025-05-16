import { Link } from "react-router-dom";
import AnimatedSection from "./AnimatedSection";

const CTA = ({
  title = "Ready to Get Started?",
  subtitle = "Join thousands of satisfied customers and experience the difference today.",
  primaryButtonText = "Sign Up Now",
  primaryButtonLink = "/register",
  secondaryButtonText = "Contact Sales",
  secondaryButtonLink = "/contact",
  className = "",
}) => {
  return (
    <section
      className={`py-16 bg-gradient-to-r from-blue-300 via-blue-500 to-blue-100 text-white ${className}`}
    >
      <div className="container mx-auto px-4 text-center">
        <AnimatedSection className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{title}</h2>
          <p className="text-lg mb-8">{subtitle}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to={primaryButtonLink}
              className="btn bg-white text-blue-500 hover:bg-gray-100 rounded-full border-none shadow-md hover:shadow-lg transform hover:-translate-y-1"
            >
              {primaryButtonText}
            </Link>
            <Link
              to={secondaryButtonLink}
              className="btn btn-outline bg-white text-blue-500 hover:bg-white hover:text-blue-500 rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-1"
            >
              {secondaryButtonText}
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default CTA;
