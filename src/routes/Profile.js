import React, { useState } from "react";
import { firebaseAuth, firebaseStore } from "../Fbase";
import { useHistory } from "react-router-dom";
import { faSnapchat } from "@fortawesome/free-brands-svg-icons";

const Profile = ({ UserObject, refreshUser }) => {
  const history = useHistory();
  const [NewDisplayName, setNewDisplayName] = useState(UserObject.displayName);
  const onLogOut = () => {
    firebaseAuth.signOut();
    history.push("/");
  };

  const onChangeDisplayName = async (event) => {
    event.preventDefault();
    if (UserObject.displayName !== NewDisplayName) {
      await UserObject.updateProfile({
        displayName: NewDisplayName,
      });
      refreshUser();
      // onUpdateDisplayName();

      setNewDisplayName("");
    }
  };

  const onChange = (event) => {
    const { value } = event.target;
    setNewDisplayName(value);
  };

  return (
    <div className="container">
      <form onSubmit={onChangeDisplayName} className="profileForm">
        <input
          type="text"
          placeholder="Display Name"
          value={NewDisplayName}
          onChange={onChange}
          autoFocus
          className="formInput"
        />
        <input
          type="submit"
          value="Update Display Name"
          className="formBtn"
          style={{ marginTop: 10 }}
        />
      </form>
      <span className="formBtn cancelBtn logOut" onClick={onLogOut}>
        Log Out
      </span>
    </div>
  );
};

export default Profile;
