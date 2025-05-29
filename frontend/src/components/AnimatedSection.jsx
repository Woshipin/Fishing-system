import { motion, useAnimation } from "framer-motion";
import { useRef, useEffect, useMemo } from "react";
import { useInView } from "framer-motion";

const AnimatedSection = ({
  children,
  className = "",
  direction = "up",
  delay = 0,
  duration = 0.5,
  staggerChildren = 0.1,
  ...props
}) => {
  const ref = useRef(null);
  const controls = useAnimation();
  const inView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (inView) controls.start("visible");
  }, [inView, controls]);

  const getVariants = useMemo(() => {
    const base = { opacity: 0 };
    const visible = { opacity: 1 };

    switch (direction) {
      case "up":
        base.y = 50;
        visible.y = 0;
        break;
      case "down":
        base.y = -50;
        visible.y = 0;
        break;
      case "left":
        base.x = -50;
        visible.x = 0;
        break;
      case "right":
        base.x = 50;
        visible.x = 0;
        break;
      default:
        break;
    }

    return {
      hidden: base,
      visible: {
        ...visible,
        transition: { duration },
      },
    };
  }, [direction, duration]);

  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren,
        delayChildren: delay,
      },
    },
  }), [delay, staggerChildren]);

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate={controls}
      {...props}
    >
      {Array.isArray(children) ? (
        children.map((child, i) => (
          <motion.div key={i} variants={getVariants} className="w-full"> {/* Added w-full */}
            {child}
          </motion.div>
        ))
      ) : (
        <motion.div variants={getVariants} className="w-full"> {/* Added w-full */}
          {children}
        </motion.div>
      )}
    </motion.div>
  );
};

export default AnimatedSection;
