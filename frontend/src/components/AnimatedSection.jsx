import { motion } from "framer-motion";
import { useRef } from "react";

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

  const getVariants = () => {
    const variants = {
      hidden: {},
      visible: {},
    };

    switch (direction) {
      case "up":
        variants.hidden = { opacity: 0, y: 50 };
        variants.visible = { opacity: 1, y: 0 };
        break;
      case "down":
        variants.hidden = { opacity: 0, y: -50 };
        variants.visible = { opacity: 1, y: 0 };
        break;
      case "left":
        variants.hidden = { opacity: 0, x: -50 };
        variants.visible = { opacity: 1, x: 0 };
        break;
      case "right":
        variants.hidden = { opacity: 0, x: 50 };
        variants.visible = { opacity: 1, x: 0 };
        break;
      default:
        variants.hidden = { opacity: 0 };
        variants.visible = { opacity: 1 };
    }

    return variants;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren,
        delayChildren: delay,
      },
    },
  };

  const itemVariants = {
    ...getVariants(),
    visible: {
      ...getVariants().visible,
      transition: {
        duration,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
      {...props}
    >
      {Array.isArray(children) ? (
        children.map((child, index) => (
          <motion.div key={index} variants={itemVariants}>
            {child}
          </motion.div>
        ))
      ) : (
        <motion.div variants={itemVariants}>{children}</motion.div>
      )}
    </motion.div>
  );
};

export default AnimatedSection;
