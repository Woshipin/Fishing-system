import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import AnimatedSection from "../components/AnimatedSection";
import PageHeader from "../components/PageHeader";

const AboutPage = () => {
  const [aboutData, setAboutData] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = 'http://127.0.0.1:8000';

  useEffect(() => {
    const fetchAboutPageData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/about-page-cms`);
        const data = await response.json();

        setAboutData(data.about);
        setTeamMembers(data.team_members);
        setMilestones(data.milestones);

      } catch (error) {
        console.error('Error fetching about page data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutPageData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PageHeader
        title="About Our Company"
        description="We're on a mission to transform the industry with innovative solutions and exceptional service."
      />

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <AnimatedSection direction="left">
              <img
                src="assets/About/about-us.png"
                alt="Our Story"
                className="rounded-2xl shadow-lg border border-blue-200/70 shadow-blue-100/40 w-full max-w-md mx-auto h-auto object-cover box-shadow-glow"
                style={{ boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)" }}
              />
            </AnimatedSection>

            <AnimatedSection direction="right" className="space-y-6">
              <h2 className="text-3xl font-bold">Our Story</h2>
              <div className="text-gray-700 space-y-4">
                {aboutData?.story_description ? (
                  <p>{aboutData.story_description}</p>
                ) : (
                  <>
                    <p>
                      Founded in 2010, our company began with a simple idea: to create
                      products that make a difference. What started as a small team
                      working out of a garage has grown into a global company with
                      offices around the world.
                    </p>
                    <p>
                      Throughout our journey, we've remained committed to our core
                      values of innovation, quality, and customer satisfaction. We
                      believe in pushing boundaries and challenging the status quo to
                      deliver exceptional products and services.
                    </p>
                    <p>
                      Today, we're proud to serve thousands of customers worldwide and
                      continue to grow our product offerings to meet the evolving
                      needs of our clients.
                    </p>
                  </>
                )}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-300 via-blue-400 to-blue-100 z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-xl text-gray-700 mb-8">
                To empower businesses and individuals with innovative solutions
                that drive growth, efficiency, and success.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div
                className="bg-white p-6 rounded-2xl shadow-lg border border-blue-200/70 shadow-blue-100/40"
                style={{ boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)" }}
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center">
                  Innovation
                </h3>
                <p className="text-gray-600 text-center">
                  We constantly push boundaries to create cutting-edge solutions
                  that address real-world challenges.
                </p>
              </div>

              <div
                className="bg-white p-6 rounded-2xl shadow-lg border border-blue-300/50 shadow-blue-100/40"
                style={{ boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)" }}
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center">
                  Quality
                </h3>
                <p className="text-gray-600 text-center">
                  We are committed to excellence in everything we do, from
                  product development to customer service.
                </p>
              </div>

              <div
                className="bg-white p-6 rounded-2xl shadow-lg border border-dashed border-blue-300/50 shadow-blue-100/40"
                style={{ boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)" }}
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center">
                  Customer Focus
                </h3>
                <p className="text-gray-600 text-center">
                  We put our customers at the center of everything we do,
                  listening to their needs and exceeding their expectations.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Leadership Team</h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Meet the talented individuals who drive our vision and lead our
              company to success.
            </p>
          </AnimatedSection>

          <AnimatedSection className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-2xl shadow-lg border border-blue-300/50 overflow-hidden flex flex-col h-96"
                style={{ boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)" }}
              >
                <div className="h-1/2 overflow-hidden">
                  <img
                    src={member.image ? `${API_BASE_URL}/storage/${member.image}` : "assets/About/about-us.png"}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.log('Image failed to load:', e.target.src);
                      e.target.src = "assets/About/about-us.png";
                    }}
                  />
                </div>
                <div className="p-6 h-1/2 flex flex-col">
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-primary mb-3">{member.position}</p>
                  <p className="text-gray-600 flex-grow">{member.description}</p>
                </div>
              </div>
            ))}
          </AnimatedSection>
        </div>
      </section>

      <section className="py-16 relative bg-gradient-to-br from-blue-100 to-blue-300 overflow-hidden">
        <div className="absolute bottom-0 w-full h-1/3 z-0">
          <div className="relative w-full h-full">
            <div
              className="absolute bottom-0 w-full h-full bg-contain bg-bottom bg-no-repeat opacity-20"
              style={{
                backgroundImage:
                  'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 200"><path d="M0,200 L0,120 L25,120 L25,150 L50,150 L50,100 L75,100 L75,120 L100,120 L100,80 L125,80 L125,150 L150,150 L150,100 L175,100 L175,150 L200,150 L200,50 L225,50 L225,150 L250,150 L250,100 L275,100 L275,150 L300,150 L300,120 L325,120 L325,150 L350,150 L350,75 L375,75 L375,150 L400,150 L400,100 L425,100 L425,150 L450,150 L450,125 L475,125 L475,150 L500,150 L500,50 L525,50 L525,150 L550,150 L550,100 L575,100 L575,150 L600,150 L600,125 L625,125 L625,150 L650,150 L650,100 L675,100 L675,150 L700,150 L700,75 L725,75 L725,150 L750,150 L750,100 L775,100 L775,150 L800,150 L800,125 L825,125 L825,150 L850,150 L850,100 L875,100 L875,150 L900,150 L900,100 L925,100 L925,150 L950,150 L950,120 L975,120 L975,150 L1000,150 L1000,200 Z" fill="%230f2645"/></svg>\')',
              }}
            ></div>
            <div className="absolute bottom-0 right-0 w-1/4 h-full">
              <div className="absolute bottom-0 right-10 w-32 h-64 bg-blue-800 rounded-t"></div>
              <div className="absolute bottom-0 right-20 w-24 h-48 bg-blue-700 rounded-t"></div>
              <div className="absolute bottom-0 right-36 w-20 h-40 bg-blue-600 rounded-t"></div>
              <div className="absolute bottom-0 right-16 w-16 h-56 bg-blue-900 rounded-t"></div>
              <div className="absolute bottom-0 right-48 w-28 h-32 bg-blue-700 rounded-t"></div>
            </div>
            <div className="absolute bottom-0 right-12 w-24 h-8 bg-white rounded-full"></div>
            <div className="absolute bottom-0 right-24 w-36 h-12 bg-white rounded-full"></div>
            <div className="absolute bottom-4 right-48 w-20 h-10 bg-white rounded-full"></div>
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-800">
              Our Journey
            </h2>
            <p className="max-w-2xl mx-auto text-gray-700">
              Key milestones that have shaped our company and brought us to
              where we are today.
            </p>
          </div>

          <div className="max-w-5xl mx-auto relative">
            {/* Timeline path - 修复：只有多于1个里程碑才显示线条，并且线条停在倒数第二个和最后一个圆圈之间 */}
            {milestones.length > 1 && (
              <div className="absolute top-12 left-0 right-0 z-0" style={{ height: `${milestones.length * 256}px` }}>
                <motion.svg
                  className="w-full h-full"
                  viewBox={`0 0 1000 ${milestones.length * 320}`}
                  preserveAspectRatio="none"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <motion.path
                    d={`M500,40 L500,${(milestones.length - 1) * 320}`}
                    stroke="#3b82f6"
                    strokeWidth="6"
                    strokeLinecap="round"
                    fill="none"
                    filter="drop-shadow(0 2px 4px rgba(59, 130, 246, 0.5))"
                    variants={{
                      hidden: { pathLength: 0 },
                      visible: {
                        pathLength: 1,
                        transition: {
                          duration: 6,
                          ease: "easeInOut",
                          type: "spring",
                          stiffness: 30,
                          damping: 10,
                        },
                      },
                    }}
                  />
                </motion.svg>
              </div>
            )}

            <motion.div
              className="relative"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.3,
                  },
                },
              }}
            >
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.id}
                  className={`mb-32 flex flex-col md:flex-row items-center relative ${
                    index === milestones.length - 1 ? 'mb-12' : ''
                  }`}
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1 },
                  }}
                >
                  {index % 2 === 0 ? (
                    <>
                      <div className="md:w-1/2 order-2 md:order-1"></div>
                      <motion.div
                        className="order-1 md:order-2 mb-6 md:mb-0"
                        variants={{
                          hidden: { scale: 0 },
                          visible: {
                            scale: 1,
                            transition: {
                              type: "spring",
                              stiffness: 260,
                              damping: 20,
                            },
                          },
                        }}
                      >
                        <div
                          className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold mb-4 md:mb-0 mx-auto z-20 relative shadow-lg border-4 border-blue-300/50 overflow-hidden"
                          style={{ boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)" }}
                        >
                          <motion.div
                            className="absolute inset-0 bg-blue-400 rounded-full"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              delay: 0.3 + index * 0.2,
                              duration: 0.8,
                              type: "spring",
                              stiffness: 200,
                              damping: 15,
                            }}
                            style={{ originX: 0, originY: 1 }}
                          />
                          <span className="relative z-10">{milestone.year}</span>
                        </div>
                      </motion.div>
                      <motion.div
                        className="md:w-1/2 md:pl-10 order-3"
                        variants={{
                          hidden: { x: 100, opacity: 0 },
                          visible: {
                            x: 0,
                            opacity: 1,
                            transition: {
                              type: "spring",
                              stiffness: 100,
                              damping: 20,
                            },
                          },
                        }}
                      >
                        <motion.div
                          className="bg-white p-6 rounded-2xl shadow-lg transform transition-all hover:shadow-xl"
                          whileHover={{
                            scale: 1.03,
                            boxShadow: "0 0 20px rgba(59, 130, 246, 0.7)",
                          }}
                          style={{ boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)" }}
                        >
                          <h3 className="text-2xl font-bold mb-2 text-gray-800">
                            {milestone.title}
                          </h3>
                          <p className="text-gray-600">
                            {milestone.description}
                          </p>
                        </motion.div>
                      </motion.div>
                    </>
                  ) : (
                    <>
                      <motion.div
                        className="md:w-1/2 md:pr-10 order-3 md:order-1"
                        variants={{
                          hidden: { x: -100, opacity: 0 },
                          visible: {
                            x: 0,
                            opacity: 1,
                            transition: {
                              type: "spring",
                              stiffness: 100,
                              damping: 20,
                            },
                          },
                        }}
                      >
                        <motion.div
                          className="bg-white p-6 rounded-2xl shadow-lg transform transition-all hover:shadow-xl"
                          whileHover={{
                            scale: 1.03,
                            boxShadow: "0 0 20px rgba(59, 130, 246, 0.7)",
                          }}
                          style={{ boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)" }}
                        >
                          <h3 className="text-2xl font-bold mb-2 text-gray-800">
                            {milestone.title}
                          </h3>
                          <p className="text-gray-600">
                            {milestone.description}
                          </p>
                        </motion.div>
                      </motion.div>
                      <motion.div
                        className="order-1 md:order-2 mb-6 md:mb-0"
                        variants={{
                          hidden: { scale: 0 },
                          visible: {
                            scale: 1,
                            transition: {
                              type: "spring",
                              stiffness: 260,
                              damping: 20,
                            },
                          },
                        }}
                      >
                        <div
                          className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold mb-4 md:mb-0 mx-auto z-20 relative shadow-lg border-4 border-blue-300/50 overflow-hidden"
                          style={{ boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)" }}
                        >
                          <motion.div
                            className="absolute inset-0 bg-blue-400 rounded-full"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              delay: 0.3 + index * 0.2,
                              duration: 0.8,
                              type: "spring",
                              stiffness: 200,
                              damping: 15,
                            }}
                            style={{ originX: 1, originY: 1 }}
                          />
                          <span className="relative z-10">{milestone.year}</span>
                        </div>
                      </motion.div>
                      <div className="md:w-1/2 order-2 md:order-3"></div>
                    </>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.div
            className="flex justify-center mt-12 space-x-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.2,
                },
              },
            }}
          >
            <motion.div
              className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-md cursor-pointer overflow-hidden"
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: {
                  y: 0,
                  opacity: 1,
                  transition: {
                    type: "spring",
                    stiffness: 200,
                    damping: 10,
                  },
                },
              }}
              whileHover={{
                scale: 1.1,
                boxShadow: "0 0 20px rgba(59, 130, 246, 0.7)",
                rotate: 5,
              }}
              whileTap={{ scale: 0.95 }}
              style={{ boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)" }}
            >
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                initial={{ rotate: 0 }}
                animate={{ rotate: 0 }}
                whileHover={{ rotate: 360, transition: { duration: 0.5 } }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </motion.svg>
            </motion.div>
            <motion.div
              className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-md cursor-pointer overflow-hidden"
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: {
                  y: 0,
                  opacity: 1,
                  transition: {
                    type: "spring",
                    stiffness: 200,
                    damping: 10,
                  },
                },
              }}
              whileHover={{
                scale: 1.1,
                boxShadow: "0 0 20px rgba(59, 130, 246, 0.7)",
                rotate: -5,
              }}
              whileTap={{ scale: 0.95 }}
              style={{ boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)" }}
            >
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                initial={{ rotate: 0 }}
                animate={{ rotate: 0 }}
                whileHover={{ rotate: 360, transition: { duration: 0.5 } }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </motion.svg>
            </motion.div>
            <motion.div
              className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-md cursor-pointer overflow-hidden"
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: {
                  y: 0,
                  opacity: 1,
                  transition: {
                    type: "spring",
                    stiffness: 200,
                    damping: 10,
                  },
                },
              }}
              whileHover={{
                scale: 1.1,
                boxShadow: "0 0 20px rgba(59, 130, 246, 0.7)",
                rotate: 5,
              }}
              whileTap={{ scale: 0.95 }}
              style={{ boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)" }}
            >
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                initial={{ rotate: 0 }}
                animate={{ rotate: 0 }}
                whileHover={{ rotate: 360, transition: { duration: 0.5 } }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
                />
              </motion.svg>
            </motion.div>
          </motion.div>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            viewport={{ once: true }}
          >
            <motion.p
              className="text-2xl font-bold text-gray-700"
              whileHover={{ scale: 1.05, color: "#3b82f6" }}
            >
              2025
            </motion.p>
            <motion.p
              className="text-sm tracking-wider text-gray-600 mt-1"
              initial={{ letterSpacing: "0.1em" }}
              whileHover={{
                letterSpacing: "0.3em",
                transition: { duration: 0.3 },
              }}
            >
              CREATE • WORK • INSPIRE
            </motion.p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;