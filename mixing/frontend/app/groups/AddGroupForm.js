import { h } from 'preact';
import { connect } from 'preact-redux';
import { bindActions } from '../util';

import * as actions from './actions';

function AddGroupForm(props) {

	const addGroup = (event) => {
		const form = event.target;
		props.addGroup(form.title.value, props.song);
		form.reset();
		event.preventDefault();
	}

	return (
		<form action="#" className="add-group" onSubmit={addGroup}>
			<input type="text" name="title" required />
			<input type="submit" value="Add Group" />
		</form>
	);
}

export default connect(null, bindActions(actions))(AddGroupForm)
