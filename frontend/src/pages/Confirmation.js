import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Alert from "../components/Alert";
import Loader from "../components/Loader";

import AuthService from "../services/auth.service";

const Confirmation = () => {
	const { confirmationToken } = useParams(); 
	const [processing, setProcessing] = useState(true);
	const [alertState, setAlertState] = useState({
		show: false, 
		color: "green", 
		message: "", 
	});
	
	useEffect(() => {
		AuthService.verify(confirmationToken)
		.then((res) => {
			setAlertState({
				show: true,
				color: "green",
				message: "Your account has been verified. You can now login."
			});
			setProcessing(false);
		})
		.catch((err) => {
			setAlertState({
				show: true,
				color: "red",
				message: "There was an error verifying your account. Please try again."
			});
			setProcessing(false);

			console.log(err);	
		});
	}, []);
	return (
		<>
		<div className="flex h-screen">
			 <div className="m-auto">
          			{processing ? <Loader /> : null}
          			{alertState.show ? (
            				<Alert color={alertState.color} msg={alertState.msg} />
          			) : null}
        		</div>
      		</div>
    		</>
  		);
	};

export default Confirmation;
