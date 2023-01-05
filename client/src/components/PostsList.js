import React, { Component } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
	Alert,
	Jumbotron,
	ListGroup,
	ListGroupItem,
	Button,
	Spinner,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	FormGroup,
	Label,
	Input,
	Row,
	Col,
	FormFeedback
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getPosts, addPost } from '../actions/postActions';

class PostsList extends Component {
	state = {
		modal: false,
	};

	schema = Yup.object().shape({
		title: Yup.string().required('Title is required'),
		content: Yup.string().required('Content is required'),
	});

	toggle = () => {
		this.setState((prevState) => ({
			modal: !prevState.modal,
		}));
	};

	componentDidMount() {
		this.props.getPosts();
	}

	static propTypes = {
		post: PropTypes.object.isRequired,
		isAuthenticated: PropTypes.bool.isRequired,
		getPosts: PropTypes.func.isRequired,
		addPost: PropTypes.func.isRequired,
	};

	render() {
		const { posts, loading } = this.props.post;

		return (
			<div>
				{this.props.location.state !== undefined ? (
					<Alert color="info">
						{this.props.location.state.notification}
					</Alert>
				) : null}
				{this.props.isAuthenticated ? (
					<div className="mb-3">
						<Button color="danger" onClick={this.toggle}>
							Add new post
						</Button>
					</div>
				) : null}
				<Modal isOpen={this.state.modal} toggle={this.toggle}>
					<ModalHeader toggle={this.toggle}>Add new post</ModalHeader>
					<Formik
						initialValues={{ title: '', content: '' }}
						validationSchema={this.schema}
						onSubmit={(values, { setSubmitting, resetForm }) => {
							this.props.addPost({
								title: values.title,
								content: values.content,
							});
							resetForm();
							this.toggle();
						}}
					>
						{({ errors, touched, isSubmitting }) => (
							<Form>
								<ModalBody>
									<Row form>
										<Col>
											<FormGroup>
												<Label for="title">Title</Label>
												<Input
													type="text"
													name="title"
													id="title"
													tag={Field}
													invalid={
														errors.title && touched.title
													}
												/>
												<FormFeedback>
													{errors.title}
												</FormFeedback>
											</FormGroup>
										</Col>
									</Row>
									<Row form>
										<Col>
											<FormGroup>
												<Label for="content">
													Content
												</Label>
												<Input
													type="textarea"
													name="content"
													id="content"
													tag={Field}
													as="textarea"
													invalid={
														errors.content && touched.content
													}
												/>
												<FormFeedback>
													{errors.content}
												</FormFeedback>
											</FormGroup>
										</Col>
									</Row>
								</ModalBody>
								<ModalFooter>
									<Button
										color="primary"
										type="submit"
										disabled={isSubmitting}
									>
										Add post
									</Button>
									<Button
										color="secondary"
										onClick={this.toggle}
									>
										Cancel
									</Button>
								</ModalFooter>
							</Form>
						)}
					</Formik>
				</Modal>
				<Jumbotron>
					<h1 className="display-3">Welcome to MERN Forum!</h1>
					<p className="lead">
						Here is the place where you can discuss a MERN stack
						related concepts with other people.
					</p>
					<hr className="my-2" />
					<p>
						If you haven't done yet, we recommend you to{' '}
						<Link to="/register">register a new account here</Link>.
					</p>
				</Jumbotron>
				{loading ? (
					<div className="w-100 d-flex justify-content-center">
						<Spinner
							type="grow"
							color="primary"
							style={{ width: '3rem', height: '3rem' }}
						/>
					</div>
				) : (
					<ListGroup>
						<TransitionGroup className="posts-list">
							{posts.map(({ _id, title, content }) => (
								<CSSTransition
									key={_id}
									timeout={500}
									classNames="fade"
									appear
								>
									<ListGroupItem className="py-4">
										<h3>{title}</h3>
										<p>{content}</p>
										<Link to={`/post/${_id}`}>
											<Button color="primary">
												Read post
											</Button>
										</Link>
									</ListGroupItem>
								</CSSTransition>
							))}
						</TransitionGroup>
					</ListGroup>
				)}
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	post: state.post,
	isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { getPosts, addPost })(PostsList);
