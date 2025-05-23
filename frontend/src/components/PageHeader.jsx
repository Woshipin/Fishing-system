import AnimatedSection from "./AnimatedSection";

const PageHeader = ({ title, description, className = "", children }) => {
  return (
    <section className={`relative py-8 md:py-16 lg:py-20 ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-300 via-blue-400 to-blue-100 z-0"></div>
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <AnimatedSection className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
            {title}
          </h1>
          {description && (
            <p className="text-base sm:text-lg md:text-xl mt-4">
              {description}
            </p>
          )}
          {children}
        </AnimatedSection>
      </div>
    </section>
  );
};

export default PageHeader;
