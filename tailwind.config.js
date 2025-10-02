export default {
    darkMode: "class",
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontSize: {
                'fluid-base': 'clamp(1rem, 1vw + 0.25rem, 1.25rem)',   // slightly scaling body
                'fluid-lg': 'clamp(1.25rem, 2vw + 0.5rem, 2.5rem)',    // section titles
                'fluid-xl': 'clamp(1.5rem, 3vw + 0.5rem, 3rem)',       // big headers
                'fluid-2xl': 'clamp(2rem, 4vw + 1rem, 4rem)',          // hero banner
            },
        },
        screens: {
            sm: "640px",  // mobile → tablet
            md: "768px",  // tablet → small laptop
            lg: "1024px", // laptop
            xl: "1280px", // desktop
            "2xl": "1536px", // big screens/TV
        },
        plugins: [],
    },
}