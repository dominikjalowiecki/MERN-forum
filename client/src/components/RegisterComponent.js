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
	FormText,
} from 'reactstrap';
import { Redirect } from 'react-router-dom';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../actions/authActions';
import { clearErrors } from '../actions/errorActions';

const RegisterComponent = () => {
	const dispatch = useDispatch();
	const { error, auth } = useSelector((state) => state);

	useEffect(() => () => dispatch(clearErrors()), []);

	const schema = Yup.object().shape({
		username: Yup.string()
			.min(3, 'Username minimum 3 characters long!')
			.required('Username is required!'),
		email: Yup.string()
			.email('Invalid e-mail format!')
			.required('E-mail is required!'),
		password: Yup.string()
			.matches(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
				'Invalid password format!'
			)
			.required('Password is equired!'),
		confirmPassword: Yup.string()
			.oneOf([Yup.ref('password'), null], 'Passwords have to be the same!')
			.required('Confirm password is required!'),
	});

	return (
		<div>
			{auth.isAuthenticated ? <Redirect to="/" /> : null}
			{error.id === 'REGISTER_FAIL' ? (
				<Alert color="danger">{error.msg.message}</Alert>
			) : null}
			<Formik
				initialValues={{
					username: '',
					email: '',
					password: '',
					confirmPassword: '',
				}}
				validationSchema={schema}
				onSubmit={(values, { setSubmitting }) => {
					dispatch(
						register({
							username: values.username,
							email: values.email,
							password: values.password,
							confirmPassword: values.confirmPassword,
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
									<Label for="username">Username</Label>
									<Input
										type="text"
										name="username"
										id="username"
										tag={Field}
										invalid={
											errors.username && touched.username
										}
									/>
									<FormFeedback>
										{errors.username}
									</FormFeedback>
								</FormGroup>
							</Col>
						</Row>
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
									<FormText>
										At least 1 lowercase, 1 uppercase, 1
										numeric, 1 special character and must be
										at least 8 characters long.
									</FormText>
								</FormGroup>
							</Col>
						</Row>
						<Row form>
							<Col md={3}>
								<FormGroup>
									<Label for="confirm-password">
										Confirm password
									</Label>
									<Input
										type="password"
										name="confirmPassword"
										id="confirm-password"
										tag={Field}
										invalid={
											errors.confirmPassword &&
											touched.confirmPassword
										}
									/>
									<FormFeedback>
										{errors.confirmPassword}
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

export default RegisterComponent;
