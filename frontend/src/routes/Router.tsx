import { Route, Routes } from "react-router-dom";
import HomePage from "../feature/homepage";
import Register from "../feature/register";
import Login from "../feature/Login";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
function Router() {
  const { user } = useContext(AuthContext);
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
}

export default Router;
