/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,js}"],
    theme: {
      extend: {
        colors: {
          "primary": "var(--primary-color)"
        },
        spacing: {
          "layoutWith": "var(--default-layout-width)"
        }
      },
    },
    plugins: [],
  }