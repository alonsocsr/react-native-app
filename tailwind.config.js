/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        fitalic: ["Figtree-Italic", "sans-serif"],
        flight: ["Figtree-Light", "sans-serif"],
        fregular: ["Figtree-Regular", "sans-serif"],
        fmedium: ["Figtree-Medium", "sans-serif"],
        fsemibold: ["Figtree-SemiBold", "sans-serif"],
        fbold: ["Figtree-Bold", "sans-serif"],
        fextrabold: ["Figtree-ExtraBold", "sans-serif"],
        fblack: ["Figtree-Black", "sans-serif"],
      },
    },
  },
  plugins: [],
}

