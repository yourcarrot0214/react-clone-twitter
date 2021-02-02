import React, { useState, useEffect } from "react";
import { firebaseStore, firebaseStorage } from "../Fbase";
import TweetOptions from "../components/TweetOptions";
import TweetEditor from "components/TweetEditor";
import Tweet from "components/Tweet";
import CommentForm from "components/comments/CommentForm";
import CommentPage from "./CommentPage";
import Comment from "components/comments/Comment";

const TweetPage = ({
  isCreator,
  isOwner,
  tweetObject,
  commentsObject,
  UserObject,
}) => {
  useEffect(() => {
    onUpdateDisplayName("tweets");
    onUpdateDisplayName("comments");
  });

  const [IsEditing, setIsEditing] = useState(false);
  const [CommentToggle, setCommentToggle] = useState(false);
  const [NewTweet, setNewTweet] = useState(tweetObject.text);
  const [IsPublic, setIsPublic] = useState(tweetObject.IsPublic);

  const onUpdateDisplayName = (COLLECTION_NAME) => {
    firebaseStore
      .collection(COLLECTION_NAME)
      .where("creatorId", "==", UserObject.uid)
      .get()
      .then((snapshot) => {
        if (snapshot.empty) {
          console.log("No matching documents.");
          return;
        }
        snapshot.forEach((doc) => {
          firebaseStore.collection(COLLECTION_NAME).doc(doc.id).update({
            displayName: UserObject.displayName,
          });
        });
      });
  };

  const onChangeScope = async () => {
    setIsPublic(!IsPublic);
    await firebaseStore.doc(`tweets/${tweetObject.id}`).update({
      IsPublic: !IsPublic,
    });
  };

  const toggleEditing = () => {
    setIsEditing((prev) => !prev);
  };

  // CommentForm에 props로 전달
  const toggleComment = () => {
    setCommentToggle((prev) => !prev);
  };

  const onDeleteTweet = async () => {
    const check = window.confirm("정말 삭제하시겠습니까?");
    const tweetComments = commentsObject.filter(
      (comment) => comment.responseTo === tweetObject.id
    );
    if (check) {
      await firebaseStore.doc(`tweets/${tweetObject.id}`).delete();
      if (tweetComments) {
        for (let i = 0; i < tweetComments.length; i++) {
          await firebaseStore.doc(`comments/${tweetComments[i].id}`).delete();
        }
      }
      if (tweetObject.attachmentURL)
        await firebaseStorage.refFromURL(tweetObject.attachmentURL).delete();
    }
  };

  return (
    <div className="nweet">
      {IsEditing ? (
        <TweetEditor
          tweetObject={tweetObject}
          toggleEditing={toggleEditing}
          NewTweet={NewTweet}
          setNewTweet={setNewTweet}
          setIsEditing={setIsEditing}
        />
      ) : (
        <>
          <Tweet tweetObject={tweetObject} UserObject={UserObject} />
          <TweetOptions
            isOwner={isOwner}
            isCreator={isCreator}
            tweetObject={tweetObject}
            onDeleteTweet={onDeleteTweet}
            toggleEditing={toggleEditing}
            toggleComment={toggleComment}
            onChangeScope={onChangeScope}
            IsPublic={IsPublic}
          />
          {isCreator && commentsObject.length > 0 && (
            <div className="notice">{`${commentsObject.length}개의 댓글이 있습니다 :)`}</div>
          )}
          {CommentToggle &&
            commentsObject.map((comment) => (
              <Comment
                key={comment.id}
                UserObject={UserObject}
                tweetObject={tweetObject}
                commentObject={comment}
              />
            ))}
          {CommentToggle && (
            <CommentForm
              UserObject={UserObject}
              tweetObject={tweetObject}
              toggleComment={toggleComment}
            />
          )}
        </>
      )}
    </div>
  );
};

export default TweetPage;

/*
  issue A. 게시글 삭제시 댓글 삭제
    > 게시글 삭제시 해당 게시글에 있는 댓글을 같이 삭제
      - onDeleteTweet method에 logic 추가
 */
