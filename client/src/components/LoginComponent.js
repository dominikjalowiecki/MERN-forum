import React, { useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import {
	Alert,
	Button,
	FormGroup,
	Label,
	Input,
	Row,
	Col,
	FormFeedback,
} from 'reactstrap';
import { Redirect, useLocation } from 'react-router-dom';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../actions/authActions';
import { clearErrors } from '../actions/errorActions';

const LoginComponent = () => {
	const dispatch = useDispatch();
	const { error, auth } = useSelector((state) => state);
	const { state } = useLocation();

	useEffect(() => () => dispatch(clearErrors()), []);

	const schema = Yup.object().shape({
		email: Yup.string()
			.email('Invalid e-mail format!')
			.required('E-mail is required!'),
		password: Yup.string()
			.matches(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
				'Invalid password format!'
			)
			.required('Password is required!'),
	});

	const { from } = state || { from: '/' };
	if (auth.isAuthenticated) {
		return (
			<Redirect
				to={{
					pathname: from,
					state: { notification: 'You have been logged in.' },
				}}
			/>
		);
	}

	return (
		<div>
			{error.id === 'LOGIN_FAIL' ? (
				<Alert color="danger">{error.msg.message}</Alert>
			) : null}
			<Formik
				initialValues={{ email: '', password: '' }}
				validationSchema={schema}
				onSubmit={(values, { setSubmitting }) => {
					dispatch(
						login({
							email: values.email,
							password: values.password,
						})
					);
					setSubmitting(false);
				}}
			>
				{({ errors, touched, isSubmitting }) => (
					<Form>
						<Row form>
							<Col md={3}>
								<FormGroup>
									<Label for="email">E-mail</Label>
									<Input
										type="email"
										name="email"
										id="email"
										tag={Field}
										invalid={errors.email && touched.email}
									/>
									<FormFeedback>{errors.email}</FormFeedback>
								</FormGroup>
							</Col>
						</Row>
						<Row form>
							<Col md={3}>
								<FormGroup>
									<Label for="password">Password</Label>
									<Input
										type="password"
										name="password"
										id="password"
										tag={Field}
										invalid={
											errors.password && touched.password
										}
									/>
									<FormFeedback>
										{errors.password}
									</FormFeedback>
								</FormGroup>
							</Col>
						</Row>
						<Row form>
							<Col md={3}>
								<Button
									type="submit"
									disabled={isSubmitting}
									className="btn-block"
								>
									Submit
								</Button>
							</Col>
						</Row>
					</Form>
				)}
			</Formik>
		</div>
	);
};

export default LoginComponent;
