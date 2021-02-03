import React, { useState } from "react";
import { firebaseStore, firebaseStorage } from "../Fbase";
import { v4 as uuidv4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTimes,
  faLock,
  faLockOpen,
} from "@fortawesome/free-solid-svg-icons";

const welcomeMessage = [
  "오늘 하루 어땠나요?",
  "잘 지내고 계시죠?",
  "좋은 하루 되세요!",
  "만나서 반갑습니다 :)",
];

const TweetForm = ({ UserObject }) => {
  const [Tweet, setTweet] = useState("");
  const [AttachmentImage, setAttachmentImage] = useState("");
  const [IsPublic, setIsPublic] = useState(true);
  const [ErrorMessage, setErrorMessage] = useState("");
  const PLACEHOLDER = UserObject.displayName
    ? `${welcomeMessage[Math.floor(Math.random() * welcomeMessage.length)]}`
    : "프로필에서 실명을 업데이트 후 이용해주세요.";
  const onTweet = (event) => {
    const { value } = event.target;
    setTweet(value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (Tweet === "") return;
    if (UserObject.displayName === null) {
      setErrorMessage("프로필에서 닉네임 혹은 실명을 등록해 주세요.");
      return;
    }

    let attachmentURL = "";

    if (AttachmentImage !== "") {
      const attachmentRef = firebaseStorage
        .ref()
        .child(`${UserObject.uid}/${uuidv4()}`);
      const response = await attachmentRef.putString(
        AttachmentImage,
        "data_url"
      );
      attachmentURL = await response.ref.getDownloadURL();
    }

    const tweetObject = {
      email: UserObject.email,
      displayName: UserObject.displayName,
      text: Tweet,
      createdAt: new Date(),
      creatorId: UserObject.uid,
      IsPublic,
      attachmentURL,
    };

    await firebaseStore.collection("tweets").add(tweetObject);
    setTweet("");
    onClearAttachment();
  };

  const onFileChange = (event) => {
    const { files } = event.target;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const { result } = finishedEvent.currentTarget;
      setAttachmentImage(result);
    };
    if (theFile) reader.readAsDataURL(theFile);
  };

  const onClearAttachment = () => {
    setAttachmentImage("");
  };

  const onChangeScope = () => {
    setIsPublic(!IsPublic);
  };

  return (
    <>
      <div className="form__scope" onClick={onChangeScope}>
        {IsPublic ? (
          <>
            <FontAwesomeIcon icon={faLockOpen} />
            <span>게시글이 모두에게 공개됩니다.</span>
          </>
        ) : (
          <>
            <FontAwesomeIcon icon={faLock} />
            <span>게시글이 정병훈 님에게만 공개됩니다.</span>
          </>
        )}
      </div>
      <form onSubmit={onSubmit} className="factoryForm">
        <div className="factoryInput__container">
          <input
            className="factoryInput__input"
            type="text"
            placeholder={PLACEHOLDER}
            onChange={onTweet}
            maxLength={120}
            value={Tweet}
          />
          <input type="submit" value="&rarr;" className="factoryInput__arrow" />
        </div>
        {ErrorMessage && <span className="authError">{ErrorMessage}</span>}
        <label htmlFor="attach-file" className="factoryInput__label">
          <span>Add photos</span>
          <FontAwesomeIcon icon={faPlus} />
        </label>
        <input
          id="attach-file"
          type="file"
          accept="image/*"
          onChange={onFileChange}
          style={{ opacity: 0 }}
        />
        {AttachmentImage && (
          <div className="factoryForm__attachment">
            <img
              src={AttachmentImage}
              style={{
                backgroundImage: AttachmentImage,
              }}
              alt="첨부이미지"
            />
            <div className="factoryForm__clear" onClick={onClearAttachment}>
              <span>Remove</span>
              <FontAwesomeIcon icon={faTimes} />
            </div>
          </div>
        )}
      </form>
    </>
  );
};

export default TweetForm;
