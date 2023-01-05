import axios from 'axios';
import {
	GET_POSTS,
	GET_POST,
	POSTS_LOADING,
	COMMENTS_LOADING,
	ADD_POST_COMMENT,
	ADD_POST,
} from './types';

export const getPosts = () => (dispatch) => {
	dispatch(setPostsLoading());
	axios.get('/api/posts').then((res) =>
		dispatch({
			type: GET_POSTS,
			payload: res.data,
		})
	);
};

export const getPost = (id) => (dispatch) => {
	dispatch(setPostsLoading());
	axios.get(`/api/posts/${id}`).then((res) =>
		dispatch({
			type: GET_POST,
			payload: res.data,
		})
	);
};

export const addPost = ({ title, content }) => (dispatch) => {
	const body = {
		title,
		content,
	};
	axios
		.post('/api/posts', body)
		.then((res) => dispatch({ type: ADD_POST, payload: res.data }));
};

export const addComment = ({ id, content }) => (dispatch) => {
	dispatch(setCommentsLoading());
	const body = {
		content,
	};
	axios
		.post(`/api/posts/${id}/comments`, body)
		.then((res) => dispatch({ type: ADD_POST_COMMENT, payload: res.data }));
};

export const setCommentsLoading = () => {
	return {
		type: COMMENTS_LOADING,
	};
};

export const setPostsLoading = () => {
	return {
		type: POSTS_LOADING,
	};
};
