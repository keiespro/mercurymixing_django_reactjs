import { h } from 'preact';
import { connect } from 'preact-redux';
import { bindActions, stateToProps } from '../util';

import * as actions from './actions';

function AddCommentForm(props) {
	const { project, addComment, profile } = props;

	const submitComment = (event) => {
		const { content, attachment } = event.target;
		addComment({
			content: content.value,
			attachment: attachment.files[0],
			author: profile.user,
			project
		});
		event.target.reset();
		event.preventDefault();
	}

	return (
		<form action="#" className="add-comment" onSubmit={submitComment}>
			<h3>Add a new comment</h3>
			<textarea name="content" cols="30" rows="10" required></textarea>
			<input name="attachment" type="file" />
			<input type="submit" value="Add Comment" />
		</form>
	);
}

export default connect(stateToProps('profile'), bindActions(actions))(AddCommentForm)
