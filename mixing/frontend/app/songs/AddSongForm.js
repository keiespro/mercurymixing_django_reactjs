import { h } from 'preact';
import { connect } from 'preact-redux';
import { bindActions } from '../util';

import * as actions from './actions';

function AddSongForm(props) {

	const addSong = (event) => {
		const form = event.target;
		props.addSong(form.title.value);
		form.reset();
		event.preventDefault();
	}

	return (
		<form action="#" className="add-song" onSubmit={addSong}>
			<input type="text" name="title" required />
			<input type="submit" value="Add Song" />
		</form>
	);
}

export default connect(null, bindActions(actions))(AddSongForm)
