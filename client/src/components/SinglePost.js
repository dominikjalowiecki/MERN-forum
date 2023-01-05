import React, { Component, Fragment } from 'react';
import { Formik, Form, Field } from 'formik';
import {
	ListGroup,
	ListGroupItem,
	ListGroupItemHeading,
	ListGroupItemText,
	Spinner,
	Button,
	FormGroup,
	Label,
	Input,
	Row,
	Col,
	FormFeedback
} from 'reactstrap';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getPost, addComment } from '../actions/postActions';

class SinglePost extends Component {
	componentDidMount() {
		this.props.getPost(this.props.match.params.id);
	}

	static propTypes = {
		post: PropTypes.object.isRequired,
		getPost: PropTypes.func.isRequired,
		addComment: PropTypes.func.isRequired,
	};

	render() {
		const { post, loading, comments, commentsLoading } = this.props.post;
		const { _id, title, content, postedAt, postedBy } = post;

		const Post = () => (
			<div>
				<h2>{title}</h2>
				<p>{content}</p>
				<small>Posted by: {postedBy?.username}</small><br />
				<small>{new Date(postedAt).toLocaleString()}</small>
			</div>
		);

		const Comments = () => {
			return (
				<ListGroup className="mt-3">
					{comments
						.reverse()
						.map(({ _id, content, postedBy, postedAt }) => (
							<ListGroupItem key={_id}>
								<ListGroupItemHeading>
									{postedBy.username}
								</ListGroupItemHeading>
								<ListGroupItemText>{content}</ListGroupItemText>
								<ListGroupItemText>
									<small>{new Date(postedAt).toLocaleString()}</small>
								</ListGroupItemText>
							</ListGroupItem>
						))}
				</ListGroup>
			);
		};

		const schema = Yup.object().shape({
			content: Yup.string().required('Content is required!'),
		});

		return (
			<div>
				{loading ? (
					<div className="w-100 d-flex justify-content-center">
						<Spinner
							type="grow"
							color="primary"
							style={{ width: '3rem', height: '3rem' }}
						/>
					</div>
				) : (
					<Fragment>
						<Post />
						<hr />
						<Formik
							initialValues={{ content: '' }}
							validationSchema={schema}
							onSubmit={(
								values,
								{ setSubmitting, resetForm }
							) => {
								this.props.addComment({
									id: _id,
									content: values.content,
								});
								resetForm();
								setSubmitting(false);
							}}
						>
							{({ errors, touched, isSubmitting }) => (
								<Form>
									<FormGroup
										tag="fieldset"
										disabled={
											!this.props.isAuthenticated
												? true
												: false
										}
									>
										<Row form>
											<Col md={3}>
												<FormGroup>
													<Label for="comment">
														Add comment
													</Label>
													<Input
														type="textarea"
														name="content"
														id="comment"
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
										<Row form>
											<Col md={3}>
												<Button
													type="submit"
													disabled={isSubmitting}
													className="btn-block"
												>
													Add comment
												</Button>
											</Col>
										</Row>
									</FormGroup>
								</Form>
							)}
						</Formik>
						<Comments />
					</Fragment>
				)}
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	post: state.post,
	isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { getPost, addComment })(SinglePost);
