import { h } from 'preact';
import { connect } from 'preact-redux';
import { bindActions } from '../util';
import * as actions from './actions';

 function Track(props) {
 	const { track, removeTrack } = props;
	return (
		<section className="track">
			Track: {track.file}
			<button onClick={() => removeTrack(track)}>&times;</button>
		</section>
	)
}

export default connect(null, bindActions(actions))(Track);
