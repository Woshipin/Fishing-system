// Theme configuration with light blue and soft pink color palette
export const theme = {
  colors: {
    primary: "#4f46e5", // indigo-600
    secondary: "#f472b6", // pink-400
    accent: "#93c5fd",
    neutral: "#f3f4f6",
    "base-100": "#ffffff",
    info: "#3abff8",
    success: "#36d399",
    warning: "#fbbd23",
    error: "#f87272",
  },
  borderRadius: {
    box: "1rem", // rounded-2xl
    button: "0.5rem", // rounded-lg
  },
  animation: {
    transition: "all 0.3s ease-in-out",
  },
}

// Custom CSS variables for consistent styling
export const applyTheme = () => {
  const root = document.documentElement

  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value)
  })

  root.style.setProperty("--border-radius-box", theme.borderRadius.box)
  root.style.setProperty("--border-radius-button", theme.borderRadius.button)
  root.style.setProperty("--animation-transition", theme.animation.transition)
}
