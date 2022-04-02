import { useEffect } from 'react';
import axios from 'axios';

export const useDynamicHeightField = (element, value) => {
    useEffect(() => {
        if (!element) return;

        element.current.style.height = 'auto';
        element.current.style.height = element.current.scrollHeight + 'px';
    }, [element, value]);
};

export const parseCookie = (str) =>
    str
        .split(';')
        .map((v) => v.split('='))
        .reduce((acc, v) => {
            acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(
                v[1].trim()
            );
            return acc;
        }, {});

export const createComment = (newComment) => {
    makeCommentCall(newComment).then((response) => {
        if (response.status === 200) {
            // this.componentDidMount();
        } else {
            console.log('Failed to create comment');
        }
    });
};

export const makeCommentCall = async (newComment) => {
    try {
        const response = await axios.post(
            'http://localhost:3030/comment/',
            newComment
        );
        return response;
    } catch (error) {
        return false;
    }
};

export const deletePostById = (id) => {
    makePostDeleteCall(id).then((response) => {
        if (response.status === 200) {
            console.log('Sucessfully Deleted!');
            window.location = '/';
        }
    });
};

export const makePostDeleteCall = async (id) => {
    try {
        const response = await axios.delete(`http://localhost:3030/post/${id}`);
        return response;
    } catch (error) {
        console.log(error);
        return false;
    }
};