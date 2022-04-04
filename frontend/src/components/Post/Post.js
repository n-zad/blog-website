import React, { useEffect, useState } from 'react';
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

import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import { CommentReply, Comments } from '..';
import { parseCookie, deletePostById } from '../../utils';
import axios from 'axios';

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest
    })
}));

export const Post = (props) => {
    const [expanded, setExpanded] = useState(false);
    const [userId, setUserId] = useState('null');
    const [firstName, setFirstName] = useState('');
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
            .get('http://localhost:3030/user/' + props.property.userId)
            .then((user) => {
                setPostUsedId(user.userId);
                setFirstName(user.data.data.user.firstName);
            })
            .catch((error) => {
                console.log(error);
            });

        if (document.cookie) {
            let getUser = parseCookie(document.cookie).userId;
            if (getUser !== 'null') {
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
                    console.log('Sucessfully Voted!');
                    setUpvoteUsers(
                        response.data.data.upVoteUsers[0].upVoteUsers
                    );
                    setDownVoteUsers(
                        response.data.data.downVoteUsers[0].downVoteUsers
                    );
                }
            });
        } else {
            console.log('Must login first!');
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

    return (
        <Card sx={{ maxWidth: 800 }} style={{ marginTop: 50 }}>
            <CardHeader
                avatar={
                    <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                        {firstName.slice(0, 2)}
                    </Avatar>
                }
                action={
                    <IconButton
                        onClick={() => deletePostById(props.property._id)}
                    >
                        {userMatch && (
                            <DeleteOutlineIcon style={{ color: '#ee6c4d' }} />
                        )}
                    </IconButton>
                }
                title={firstName}
                subheader={props.property.createdAt.slice(0, 10)}
            />

            {props.property.imageURL !== '' ? (
                <CardMedia
                    component="img"
                    height="500"
                    image={props.property.imageURL}
                    alt="Paella dish"
                />
            ) : null}

            <CardContent>
                <Typography
                    variant="body1"
                    color="text.secondary"
                    style={{ color: 'black', fontSize: 24 }}
                >
                    {title}
                </Typography>
                <Typography paragraph>{subTitle + ' ...'}</Typography>
            </CardContent>

            <CardActions disableSpacing style={{ marginLeft: 20 }}>
                <IconButton onClick={() => votePost(userId, postId, 1)}>
                    {upVoteUsers.find((ele) => ele.userId === userId) !==
                    undefined ? (
                        <ThumbUpAltIcon
                            style={{ color: '#0077b6' }}
                            fontSize="small"
                        />
                    ) : (
                        <ThumbUpOutlinedIcon
                            style={{ color: '#0077b6' }}
                            fontSize="small"
                        />
                    )}
                </IconButton>

                <Typography style={{ padding: 10, fontSize: 14 }}>
                    {upVoteUsers.length - downVoteUsers.length}
                </Typography>

                <IconButton onClick={() => votePost(userId, postId, -1)}>
                    {downVoteUsers.find((ele) => ele.userId === userId) !==
                    undefined ? (
                        <ThumbDownAltIcon
                            style={{ color: '#ee6c4d' }}
                            fontSize="small"
                        />
                    ) : (
                        <ThumbDownOutlinedIcon
                            style={{ color: '#ee6c4d' }}
                            fontSize="small"
                        />
                    )}
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
                    <Comments comments={comments} postId={postId} />
                )}
            </Collapse>
        </Card>
    );
};