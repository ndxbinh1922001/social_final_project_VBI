import { Route, Routes, Navigate } from "react-router-dom";
import HomePage from "../feature/homepage";
import Register from "../feature/register";
import Login from "../feature/Login";
<<<<<<< HEAD
import Profile from "../feature/Profile";
=======
>>>>>>> e1dd4b1c8762bba391c735c7ea0ae1e1fab8fa94
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
function Router() {
  const { user } = useContext(AuthContext);
  console.log("user:", user);
  
  return (
    <Routes>
<<<<<<< HEAD
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element= {user !== null ? <HomePage /> : <Navigate to="/login" />} /> 
      <Route
          path="/profile/:username"
          element={user ? <Profile /> : <Navigate to="/login" />}
        />
=======
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<HomePage />} />
>>>>>>> e1dd4b1c8762bba391c735c7ea0ae1e1fab8fa94
    </Routes>
  );
}

export default Router;
