import { h } from 'preact';
import { connect } from 'preact-redux';
import { bindActions, fileSize, getClassName } from '../util';
import * as actions from './actions';

function Track(props) {
	const { track, removeTrack, cancelTrack } = props;
	const { request } = track;

	const status = () => {
		if (typeof request === 'undefined') return null;
		if (request.error) return request.errorResponse.detail;
		if (request.canceled) return 'Canceled';
		if (request.deleting) return 'Deleting...';
		if (request.posting) {
			if (request.progress === null) return (
				<div className="indeterminate progress">
					<progress />
					<span>Uploading...</span>
				</div>
			)

			let status = 'Waiting...';
			if (request.progress > 0) status = `${(request.progress*100).toFixed(1)}%`;
			if (request.progress === 1) status = 'Saving...';

			return (
				<div className="determinate progress">
					<progress value={request.progress} />
					<span>{status}</span>
				</div>
			)
		}
		return null;
	}

	const deleteButton = () => {
		if (typeof request !== 'undefined') {
			if (request.canceled || request.error || request.deleting) return null;
			if (request.posting) return (
				<button className="cancel" onClick={() => cancelTrack(track)}>
					<span>Cancel</span>
				</button>
			)
		}
		return (
			<button className="delete" onClick={() => removeTrack(track)}>
				<span>Delete</span>
			</button>
		)
	}

	return (
		<div className={getClassName(track, 'track')}>
			<div className="name">{track.file.name}</div>
			<div className="size">{fileSize(track.file.size)}</div>
			<div className="status">{status()}</div>
			{deleteButton()}
		</div>
	)
}

export default connect(null, bindActions(actions))(Track);
