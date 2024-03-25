import React, { useContext, useEffect } from "react"; 
import { Context } from "./context"; 
import Navbar from "./components/Navbar";
import { Route, Routes, Navigate } from "react-router-dom"; 
import { Link } from "react-router-dom";
import Signup from "./pages/Signup";
import Confirmation from "./pages/Confirmation";
import LoginForm from "./components/LoginForm";
import Login from "./pages/Login";
import View from "./pages/View";

const RequireAuth = ({ children }) => {
  const { state } = useContext(Context);
  return state.user? children : <Navigate to="/login" replace />; 
}; 

const OnlyNotAuth = ({ children }) => {
  const { state } = useContext(Context);
  return !state.auth ? children : <Navigate to="/" replace />; 
}; 

const Home = () => {
  return <h1>Hello, user!</h1>; 
}; 

const App = () => {
  const { dispatch } = useContext(Context);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("educativeUser"));
    dispatch({
        type: "LOGIN",
        payload: {
          user,
          token: user.token,
        },
      });
     }, []);
  return (
     <>
      <Navbar auth={false} />
      <Routes>
        <Route
          path="/"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />

        <Route
          path="/signup"
          element={
            <OnlyNotAuth>
              <Signup />
            </OnlyNotAuth>
          }
        />
        <Route
          path="/login"
          element={
            <OnlyNotAuth>
              <Login />
            </OnlyNotAuth>
          }
        />
        <Route
          path="/verify/:confirmationToken"
          element={
            <OnlyNotAuth>
              <Confirmation />
            </OnlyNotAuth>
          }
        />
        <Route
          path="/confirmation/:confirmationToken"
          element={
            <OnlyNotAuth>
              <Confirmation />
            </OnlyNotAuth>
          }
        />

        <Route
          path="/view"
          element={
            <RequireAuth>
              <View />
            </RequireAuth>
          }
          />
      </Routes>
    </>
  )
}; 

const Actions = ({ auth, customStyle, dispatch  }) => {
   return (
    <>
      {auth ? (
        <button
          type="button"
          className={customStyle}
          onClick={() => {
            localStorage.removeItem("educativeUser");
            dispatch({
              type: "LOGOUT",
            });
          }}
        >
          Logout
        </button>
      ) : (
        <>
          <Link to="/login" className={customStyle}>
            Login
          </Link>
          <Link to="/signup" className={customStyle}>
            Signup
          </Link>
        </>
      )}
    </>
  );
};


export default App; 

 