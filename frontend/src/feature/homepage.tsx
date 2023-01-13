import * as React from "react";
import Topbar from "./components/topbar/Topbar.jsx";
import Sidebar from "./components/sidebar/Sidebar";
import Feed from "./components/feed/Feed";
import Rightbar from "./components/rightbar/Rightbar";
import "./css/homepage.css";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
interface IHomePageProps {}
const HomePage: React.FunctionComponent<IHomePageProps> = (props) => {
<<<<<<< HEAD
  // export default function HomePage() {
=======
>>>>>>> e1dd4b1c8762bba391c735c7ea0ae1e1fab8fa94
  const { user } = useContext(AuthContext);
  return (
    <>
    
       <Topbar />
      
      <div className="homeContainer">
        <Sidebar />
        <Feed username="" />
        <Rightbar user={user} />
      </div>
    </>
  );
};

export default  HomePage

