import { Route, Routes } from "react-router-dom";
import HomePage from "../feature/homepage";
import Register from "../feature/register";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
function Router() {
  const { user } = useContext(AuthContext);
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default Router;
