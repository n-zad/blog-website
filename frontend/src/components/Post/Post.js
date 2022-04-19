import React, { useEffect, useState } from "react";

import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import ThumbDownOutlinedIcon from "@mui/icons-material/ThumbDownOutlined";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";

import { CommentReply, Comments } from "..";
import { parseCookie, deletePostById } from "../../utils";
import axios from "axios";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export const Post = (props) => {
  const [expanded, setExpanded] = useState(false);
  const [userId, setUserId] = useState("null");
  const [firstName, setFirstName] = useState("");
  const [photo, setPhoto] = useState("");
  const [login, setLogin] = useState(false);
  const [userMatch, setUserMatch] = useState(false);
  const [postUserId, setPostUsedId] = useState(props.property.userId);
  const [postId, setPostId] = useState(props.property._id);
  const [title, setTitle] = useState(props.property.title);
  const [message, setMessage] = useState(props.property.message);
  const [turnOnComments, setTurnOffComments] = useState(
    props.property.turnOnComments
  );
  const [subTitle, setSubtitle] = useState(
    props.property.message.slice(0, 350)
  );
  const [comments, setComments] = useState(props.property.comments);
  const [upVoteUsers, setUpvoteUsers] = useState(props.property.upVoteUsers);
  const [downVoteUsers, setDownVoteUsers] = useState(
    props.property.downVoteUsers
  );

  useEffect(() => {
    axios
      .get("http://localhost:3030/user/" + props.property.userId)
      .then((user) => {
        setPostUsedId(user.userId);
        setFirstName(user.data.data.user.firstName);
        setPhoto(user.data.data.user.photo);
      })
      .catch((error) => {
        console.log(error);
      });

    if (document.cookie) {
      let getUser = parseCookie(document.cookie).userId;
      if (getUser !== "null") {
        setUserId(getUser);
        setLogin(true);
        if (getUser === postUserId) {
          setUserMatch(true);
        }
      } else {
        setUserId(null);
      }
    }
  }, []);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  // votes posts
  function votePost(userId, postId, value) {
    if (userId !== null) {
      makeVoteCall(userId, postId, value).then((response) => {
        if (response.status === 200) {
          console.log("Sucessfully Voted!");
          setUpvoteUsers(response.data.data.upVoteUsers[0].upVoteUsers);
          setDownVoteUsers(response.data.data.downVoteUsers[0].downVoteUsers);
        }
      });
    } else {
      console.log("Must login first!");
    }
  }

  async function makeVoteCall(userId, postId, value) {
    try {
      const response = await axios.post(
        `http://localhost:3030/post/vote/${postId}`,
        { userId: userId, value: value }
      );
      return response;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  // save post
  function savePost(userId, postId) {
    if (userId !== null) {
      makeSaveCall(userId, postId).then((response) => {
        if (response.status === 200) console.log("Successfully Saved Post!");
      });
    } else {
      console.log("Must login first!");
    }
  }

  async function makeSaveCall(userId, postId) {
    try {
      const response = await axios.post(
        `http://localhost:3030/user/saved/${userId}`,
        { postId: postId }
      );
      return response;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  return (
    <Card sx={{ maxWidth: 800 }} style={{ marginTop: 50 }}>
      <CardHeader
        avatar={
          photo !== "" && (
            <Avatar
              src={`https://res.cloudinary.com/${process.env.REACT_APP_CLOUD_NAME}/image/upload/c_crop,g_custom/${photo}`}
            />
          )
        }
        action={
          userMatch && (
            <IconButton onClick={() => deletePostById(props.property._id)}>
              <DeleteOutlineIcon style={{ color: "#ee6c4d" }} />
            </IconButton>
          )
        }
        title={firstName}
        subheader={props.property.createdAt.slice(0, 10)}
      />

      {props.property.imageURL !== "" ? (
        <CardMedia
          height="500"
          image={props.property.imageURL}
          alt="Paella dish"
        />
      ) : null}

      <CardContent>
        <Typography
          variant="body1"
          color="text.secondary"
          style={{ color: "black", fontSize: 24 }}
        >
          {title}
        </Typography>
        <Typography paragraph>{subTitle + " ..."}</Typography>
      </CardContent>

      <CardActions disableSpacing style={{ marginLeft: 20 }}>
        <IconButton onClick={() => votePost(userId, postId, 1)}>
          {upVoteUsers.find((ele) => ele.userId === userId) !== undefined ? (
            <ThumbUpAltIcon style={{ color: "#0077b6" }} fontSize="small" />
          ) : (
            <ThumbUpOutlinedIcon
              style={{ color: "#0077b6" }}
              fontSize="small"
            />
          )}
        </IconButton>

        <Typography style={{ padding: 10, fontSize: 14 }}>
          {upVoteUsers.length - downVoteUsers.length}
        </Typography>

        <IconButton onClick={() => votePost(userId, postId, -1)}>
          {downVoteUsers.find((ele) => ele.userId === userId) !== undefined ? (
            <ThumbDownAltIcon style={{ color: "#ee6c4d" }} fontSize="small" />
          ) : (
            <ThumbDownOutlinedIcon
              style={{ color: "#ee6c4d" }}
              fontSize="small"
            />
          )}
        </IconButton>

        <IconButton onClick={() => savePost(userId, postId)}>
          <BookmarkBorderOutlinedIcon style={{ color: "orange" }} />
        </IconButton>

        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>{message}</Typography>
        </CardContent>

        {turnOnComments && (
          <Comments comments={comments} postId={postId} userId={userId} />
        )}
      </Collapse>
    </Card>
  );
};
