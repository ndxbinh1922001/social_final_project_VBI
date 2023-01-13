import "./css/profile.css";
import Topbar from "./components/topbar/Topbar";
import Sidebar from "./components/sidebar/Sidebar";
import Feed from "./components/feed/Feed";
import Rightbar from "./components/rightbar/Rightbar";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Profile() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user, setUser] = useState({});
  const username = useParams().username;
  const { user: userCurrent } = useContext(AuthContext);
  useEffect(() => {
    async function fetchUser() {
      const token =userCurrent.token;
        
      const res = await axios.get(`/users?username=${username}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    }
    fetchUser();
  }, [username]);
  console.log("user:",user);
  return (
    <>
      <Topbar />
      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img
                className="profileCoverImg"
                src={user.coverPicture || `${PF}person/no-cover.png`}
                alt=""
              />
              <img
                className="profileUserImg"
                src={user.profilePicture || `${PF}person/no-avatar.png`}
                alt=""
              />
            </div>
            <div className="profileInfo">
              <h4 className="profileInfoName">{user.username}</h4>
              <span className="profileInfoDesc">{user.desc}</span>
            </div>
          </div>
          <div className="profileRightBottom">
            <Feed username={username} />
            <Rightbar user={user} />
          </div>
        </div>
      </div>
    </>
  );
}
