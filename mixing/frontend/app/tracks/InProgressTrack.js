import { h } from 'preact';
import { connect } from 'preact-redux';
import { bindActions, fileSize } from '../util';
import * as actions from './actions';

 function Track(props) {
 	const { track } = props;

	return (
		<section className="inprogress-track">
			Uploading: {track.file.name} ({fileSize(track.file.size)})
		</section>
	)
}

export default connect(null, bindActions(actions))(Track);
