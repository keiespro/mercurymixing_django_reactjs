import { h } from 'preact';
import { connect } from 'preact-redux';
import { bindActions, fileSize } from '../util';
import * as actions from './actions';

 function Track(props) {
 	const { track, removeTrack } = props;
	return (
		<section className="track">
			Track: {track.file.name} ({fileSize(track.file.size)})
			<button onClick={() => removeTrack(track)}>&times;</button>
		</section>
	)
}

export default connect(null, bindActions(actions))(Track);
