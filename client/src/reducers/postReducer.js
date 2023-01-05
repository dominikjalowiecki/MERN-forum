import {
	GET_POSTS,
	GET_POST,
	ADD_POST,
	POSTS_LOADING,
	ADD_POST_COMMENT,
	COMMENTS_LOADING,
} from '../actions/types';

const initialState = {
	posts: [],
	post: {},
	comments: [],
	commentsLoading: false,
	loading: false,
};

export default function (state = initialState, action) {
	switch (action.type) {
		case GET_POSTS:
			return {
				...state,
				posts: action.payload,
				loading: false,
			};
		case GET_POST:
			return {
				...state,
				post: action.payload,
				comments: action.payload.comments,
				loading: false,
			};
		case ADD_POST:
			return {
				...state,
				posts: [action.payload, ...state.posts],
			};
		case ADD_POST_COMMENT:
			return {
				...state,
				comments: action.payload.comments,
				commentsLoading: false,
			};
		case COMMENTS_LOADING:
			return {
				...state,
				commentsLoading: true,
			};
		case POSTS_LOADING:
			return {
				...state,
				loading: true,
			};
		default:
			return state;
	}
}
