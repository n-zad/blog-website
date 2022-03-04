import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Tooltip from '@mui/material/Tooltip';

import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import CommentReply from './CommentReply';

import Comments from './Comments';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function Posts(props) {
  const [expanded, setExpanded] = React.useState(false);

  const [state] = React.useState({
    userId: props.currentUserId,
    login: true,
    userMatch: false
  })

  if(state.userId === undefined) {
    state.userId = -1;
  }

  if(state.userId.length >= 5) {
    state.login = false;
  }

  if(state.userId === props.property.userId) {
    state.userMatch = true
  }

  var subTitle = props.property.message.slice(0,350);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ maxWidth: 800 }}   style = {{marginTop: 50}}>

      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            SM
          </Avatar>
        }
        action = {
        <IconButton onClick={() => props.deletePostById(props.property._id)} >
            {state.userMatch &&
            <DeleteOutlineIcon style={{color: '#ee6c4d'}}  />
            }
        </IconButton>
        }
        title={props.property.userId}
        subheader={props.property.createdAt.slice(0,10)}
      />

      {props.property.imageURL !== '' ?
        <CardMedia
        component="img"
        height="500"
        image= {props.property.imageURL}
        alt="Paella dish"
      /> : null}

      <CardContent>
        <Typography variant="body1" color="text.secondary" style={{color: 'black', fontSize: 24}}>
          {props.property.title}
        </Typography>
        <Typography paragraph>
          {subTitle + " ..."}
        </Typography>
      </CardContent>

      <CardActions disableSpacing style={{marginLeft: 20}}>
       {/* like thumb */}
       <Tooltip title={
            (props.property.upVoteUsers.find(ele => ele.userId === props.currentUserId) === undefined) ? 
            "Like"
            :
            "Liked"
          }>
        <IconButton>
          <ThumbUpOutlinedIcon onClick={() => props.vote(props.property._id, true)} style = {{color: '#0077b6'}} fontSize ="small"/>
        </IconButton>
        </Tooltip>

        {/* like-plus-displike number */}
        <Typography style= {{padding: 10, fontSize: 14}}>
          {props.property.upVoteUsers.length - props.property.downVoteUsers.length}
        </Typography>

        {/* dislike thumb */}
        <Tooltip title={
            (props.property.downVoteUsers.find(ele => ele.userId === props.currentUserId) === undefined) ? 
            "Dislike"
            :
            "Disliked"
          }>
        <IconButton>
          <ThumbDownOutlinedIcon onClick={() => props.vote(props.property._id, false)} style = {{color: '#ee6c4d'}} fontSize ="small"/>
          </IconButton>
        </Tooltip>
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
          <Typography paragraph>
            {props.property.message}
          </Typography>
        </CardContent>

      <Comments comments={props.property.comments} />
      {!state.login &&
      <CommentReply userId = {state.userId} postId={props.property._id} createComment={props.createComment} />
      }
      </Collapse>

    </Card>
  );
}
