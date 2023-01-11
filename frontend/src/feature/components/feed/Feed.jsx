import Post from "../post/Post";
import Share from "../share/Share";
import "./feed.css";
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

export default function Feed({ username }) {
  const [posts, setPosts] = useState([]);
  const { user } = useContext(AuthContext);
  useEffect(() => {
    async function fetchPosts() {
      const token = user.token;

      const res = username
        ? await axios.get(`/posts/profile/${username}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        : await axios.get(`/posts/timeline/${user.user._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
      setPosts(res.data);
    }
    fetchPosts();
  }, [username, user.user._id, user.token]);
  return (
    <div className="feed">
      <div className="feedWrapper">
        <Share />
        {posts.map((p) => (
          <Post key={p._id} post={p} />
        ))}
      </div>
    </div>
  );
}
