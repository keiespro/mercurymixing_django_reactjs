import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import { bindActions } from '../util';

import * as actions from './actions';

@connect(null, bindActions(actions))
export default class AddSongForm extends Component {

	addSong = (event) => {
		const form = event.target;
		this.props.addSong(form.title.value);
		form.reset();
		event.preventDefault();
	}

	render(props, state) {
		return (
			<form action="#" className="add-song" onSubmit={this.addSong}>
				<input type="text" name="title" required />
				<input type="submit" value="Add Song" />
			</form>
		);
	}
}
