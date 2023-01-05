import axios from 'axios';
import { returnErrors } from './errorActions';
import {
	USER_LOADING,
	USER_LOADED,
	AUTH_ERROR,
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	LOGOUT_SUCCESS,
	REGISTER_SUCCESS,
	REGISTER_FAIL,
} from './types';

export const loadUser = () => (dispatch) => {
	dispatch({ type: USER_LOADING });
	axios
		.get('/api/users/me')
		.then((res) => dispatch({ type: USER_LOADED, payload: res.data }))
		.catch((err) => {
			dispatch(returnErrors(err.response.data, err.response.status));
			dispatch({
				type: AUTH_ERROR,
			});
		});
};

export const register = ({ username, email, password, confirmPassword }) => (
	dispatch
) => {
	const body = {
		username,
		email,
		password,
		confirmPassword,
	};
	axios
		.post('/api/users/register', body)
		.then((res) => dispatch({ type: REGISTER_SUCCESS, payload: res.data }))
		.catch((err) => {
			dispatch(
				returnErrors(
					err.response.data,
					err.response.status,
					'REGISTER_FAIL'
				)
			);
			dispatch({
				type: REGISTER_FAIL,
			});
		});
};

export const login = ({ email, password }) => (dispatch) => {
	const body = { email, password };
	axios
		.post('/api/users/login', body)
		.then((res) => dispatch({ type: LOGIN_SUCCESS, payload: res.data }))
		.catch((err) => {
			dispatch(
				returnErrors(
					err.response.data,
					err.response.status,
					'LOGIN_FAIL'
				)
			);
			dispatch({
				type: LOGIN_FAIL,
			});
		});
};

export const logout = () => (dispatch) => {
	axios.post('/api/users/logout');
	dispatch({
		type: LOGOUT_SUCCESS,
	});
};
