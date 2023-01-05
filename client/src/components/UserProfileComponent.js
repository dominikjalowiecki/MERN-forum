import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

const UserProfileComponent = () => {
	const { user } = useSelector((state) => state.auth);

	return (
		<div>
			<dl>
				<dt>Username</dt>
				<dd>{ user.username }</dd>
				<dt>Email</dt>
				<dd>{ user.email }</dd>
				<dt>Created at</dt>
				<dd>{ new Date(user.date).toLocaleString() }</dd>
			</dl>
		</div>
	);
};

export default UserProfileComponent;
