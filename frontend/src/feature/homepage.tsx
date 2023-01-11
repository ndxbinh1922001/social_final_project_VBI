import * as React from "react";
import Topbar from "./components/topbar/Topbar";
import Sidebar from "./components/sidebar/Sidebar";
import Feed from "./components/feed/Feed";
import Rightbar from "./components/rightbar/Rightbar";
import "./css/homepage";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
interface IHomePageProps {}
const { user } = useContext(AuthContext);
const HomePage: React.FunctionComponent<IHomePageProps> = (props) => {
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

export default HomePage;
