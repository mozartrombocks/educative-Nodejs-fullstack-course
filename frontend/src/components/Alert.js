import React from'react';
const Alert = ({ color, msg}) => {
	const [showAlert, setShowAlert] = React.useState(true);
	return (
		<>
		{showAlert ? (
			<div
				className={
					"text-white px-6 py-4 border-0 rounded relative mb-4 bg-" +
					color + 
					"-500"
				}
			>
				<span className="text-xl inline-block mr-5 align-middle">
					<i class="fas fa-bell"></i>
				</span>
				<span className="inline-block align-middle mr-8">{msg}</span>
				<button
					className="absolute bg-transparent text-2xl font-semibold leading-none right-0 top-0 mt-4 mr-6 outline-none focus:outline-none"
					onClick={() => setShowAlert(false)}
				>
					<span>×</span>
				</button>
				</div>
			) : null}
		</>
	); 
}; 

export default Alert;