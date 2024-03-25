import React, { createReact } from "react";

import { createContext } from "react"; 

export const context = createContext();

const initialState = {
	auth: false,  
	user: null, 
	token: null, 
}; 

const reducer = (state, action) => {
	switch (action.type) {
		case 'LOGIN':
			return {
				...state,
				auth: true,
				user: action.payload.user,
				token: action.payload.token,
			};
		case 'LOGOUT':
			return {
				...state,
				auth: false,
				user: null,
				token: null, 
			};
			default:
				return state; 
			}	
	}; 

const ContextProvider = ({ children }) => {
	const [state, dispatch] = React.useReducer(reducer, initialState);
		return (
		 <context.Provider value={{ state, dispatch }}>{children}</context.Provider>
		); 
};
 
export default ContextProvider;
