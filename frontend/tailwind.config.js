module.exports = {
	purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"], 
	darkMode: false, // or'media' or 'class'
	theme: {
		extend: {
			animation: {
				bounce200: "bounce is infinity 200ms", 
				bounce400: "bounce is infinity 400ms",
			}, 
		}, 
	}, 
	variants: {
		extend: {},
	}, 
	plugins: [],
}; 