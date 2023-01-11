import "./share.css";
import { PermMedia, Label, Room, EmojiEmotions } from "@material-ui/icons";
import { useContext, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { useSubstrateState } from "./substrate-lib";
import { web3FromAddress } from "@polkadot/extension-dapp";

export default function Share() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user } = useContext(AuthContext);
  const desc = useRef();
  const [file, setFile] = useState(null);
  const { api, keyring } = useSubstrateState();
  const accounts = keyring.getPairs();
  console.log("accounts:", accounts);

  const submitHandler = async (e) => {
    e.preventDefault();
    const newPost = {
      userId: user.user._id,
      desc: desc.current.value,
    };
    const token = user.token;
    if (file) {
      console.log(file);

      const data = new FormData();
      const fileName = Date.now() + file.name;
      setFile({ ...file, name: fileName });
      console.log(file.name);

      data.append("file", file);
      data.append("name", fileName);
      newPost.img = PF + fileName;
      try {
        await axios.post("/upload", data);
      } catch (error) {}
    }
    console.log("newPost:", newPost);

    try {
      await axios.post("/posts", newPost, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {}
  };
  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img
            className="shareProfileImg"
            src={
              user.user.profilePicture
                ? user.user.profilePicture
                : `${PF}person/1.jpeg`
            }
            alt=""
          />
          <input
            placeholder={"What's in your mind " + user.user.username + "?"}
            className="shareInput"
            ref={desc}
          />
        </div>
        <hr className="shareHr" />
        <form className="shareBottom" onSubmit={submitHandler}>
          <div className="shareOptions">
            <label htmlFor="file" className="shareOption">
              <PermMedia htmlColor="tomato" className="shareIcon" />
              <span className="shareOptionText">Photo or Video</span>
              <input
                style={{ display: "none" }}
                type="file"
                id="file"
                accept=".png,.jpeg,.jpg"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
            <div className="shareOption">
              <Label htmlColor="blue" className="shareIcon" />
              <span className="shareOptionText">Tag</span>
            </div>
            <div className="shareOption">
              <Room htmlColor="green" className="shareIcon" />
              <span className="shareOptionText">Location</span>
            </div>
            <div className="shareOption">
              <EmojiEmotions htmlColor="goldenrod" className="shareIcon" />
              <span className="shareOptionText">Feelings</span>
            </div>
          </div>
          <button className="shareButton" type="submit">
            Share
          </button>
        </form>
      </div>
    </div>
  );
}
