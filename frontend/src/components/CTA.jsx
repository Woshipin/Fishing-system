import { Link } from "react-router-dom";
import AnimatedSection from "./AnimatedSection";

const CTA = ({
  title = "Ready to Get Started?",
  subtitle = "Join thousands of satisfied customers and experience the difference today.",
  primaryButtonText = "Sign Up Now",
  primaryButtonLink = "/register",
  secondaryButtonText = "Contact Us",
  secondaryButtonLink = "/contact",
  className = "",
}) => {
  return (
    <section
      className={`py-16 bg-gradient-to-r from-blue-600/90 via-blue-700/90 to-blue-800/90 backdrop-blur-sm text-white relative ${className}`}
    >
      <div className="container mx-auto px-4 text-center">
        <AnimatedSection className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{title}</h2>
          <p className="text-lg mb-8">{subtitle}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {[
              {
                text: primaryButtonText,
                link: primaryButtonLink,
                style: "bg-white text-blue-500 hover:bg-gray-100",
              },
              {
                text: secondaryButtonText,
                link: secondaryButtonLink,
                style: "btn-outline bg-white text-blue-500 hover:bg-white",
              },
            ].map(({ text, link, style }, i) => (
              <Link
                key={i}
                to={link}
                className={`btn rounded-full border-none shadow-md hover:shadow-lg transform hover:-translate-y-1 ${style}`}
              >
                {text}
              </Link>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default CTA;
