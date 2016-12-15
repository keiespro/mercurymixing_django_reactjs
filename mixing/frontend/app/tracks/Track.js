import { h } from 'preact';
import { connect } from 'preact-redux';
import { bindActions, fileSize } from '../util';
import * as actions from './actions';

function Track(props) {
	const { track, removeTrack, cancelTrack } = props;

	const progress = () => {
		if (track.canceled) return null;

		// Track is uploading but we don't know the exact progress
		if (track.progress === null) return (
			<div className="indeterminate">
				<progress />
				<span className="status">Uploading...</span>
			</div>
		)

		let status = 'Waiting';
		if (track.progress > 0) status = `${(track.progress*100).toFixed(1)}%`;

		// ...now we know the exact progress
		return (
			<div className="determinate">
				<progress value={track.progress} />
				<span className="status">{status}</span>
			</div>
		)
	}

	const cancelButton = () => {
		if (track.canceled) return <span>Canceled</span>;
		return <button onClick={() => cancelTrack(track)}>Cancel</button>
	}

	// Render 'in progress' Track
	if (track.posting) return (
		<div className={track.canceled ? 'canceled-track': 'inprogress-track'}>
			{track.file.name} ({fileSize(track.file.size)})
			{progress()}
			{cancelButton()}
		</div>
	)

	// ...or render the complete Track
	return (
		<div className="track">
			{track.file.name} ({fileSize(track.file.size)})
			<button onClick={() => removeTrack(track)}>&times;</button>
		</div>
	)
}

export default connect(null, bindActions(actions))(Track);
