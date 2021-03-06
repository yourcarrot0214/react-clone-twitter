import React from "react";
import { firebaseAuth, firebaseInstance } from "Fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faGithub } from "@fortawesome/free-brands-svg-icons";

function SocialSignInForm() {
  const onSocialLogin = async (event) => {
    const { name } = event.target;
    let provider;
    if (name === "google") {
      provider = new firebaseInstance.auth.GoogleAuthProvider();
    } else if (name === "github") {
      provider = new firebaseInstance.auth.GithubAuthProvider();
    }
    await firebaseAuth.signInWithRedirect(provider);
  };
  return (
    <div className="authBtns">
      <button onClick={onSocialLogin} name="google" className="authBtn">
        Login with Google <FontAwesomeIcon icon={faGoogle} />
      </button>
      <button onClick={onSocialLogin} name="github" className="authBtn">
        Login with Github <FontAwesomeIcon icon={faGithub} />
      </button>
    </div>
  );
}

export default SocialSignInForm;
