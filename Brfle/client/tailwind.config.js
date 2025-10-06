// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }


/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        // heading: ["Poppins", "sans-serif"],
         sans: ['"Open Sans"', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
         brownGold: "#996515", // keep Tailwind defaults, but you can tune green shades here if you want
      }
    },
  },
  plugins: [],
};
