import { Route, Routes, Navigate } from "react-router-dom";
import HomePage from "../feature/homepage";
import Register from "../feature/register";
import Login from "../feature/Login";
import Profile from "../feature/Profile";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
function Router() {
  const { user } = useContext(AuthContext);
  console.log("user:", user);
  
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element= {user !== null ? <HomePage /> : <Navigate to="/login" />} /> 
      <Route
          path="/profile/:username"
          element={user ? <Profile /> : <Navigate to="/login" />}
        />
    </Routes>
  );
}

export default Router;
