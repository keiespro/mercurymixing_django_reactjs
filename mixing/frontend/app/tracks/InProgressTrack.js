import { h } from 'preact';
import { fileSize } from '../util';

export default function InProgressTrack(props) {
	const { track } = props;

	const className = () => {
		if (track.canceled) return 'canceled-track';
		return 'inprogress-track';
	}

	const determinate = () => {
		if (track.canceled) return ' ';
		return (
			<div className="determinate">
				<progress value={track.progress} />
				{track.progress > 0 ? `${(track.progress*100).toFixed(1)}%` : 'Waiting...'}
			</div>
		)
	}

	const indeterminate = () => {
		if (track.canceled) return ' ';
		return (
			<div className="indeterminate">
				<progress />
				Uploading...
			</div>
		)
	}

	const cancelButton = () => {
		if (track.canceled) return 'Canceled';
		return <button onClick={() => track.xhr.abort()}>Cancel</button>
	}

	return (
		<section className={className()}>
			{track.file.name} ({fileSize(track.file.size)})
			{track.progress === null ? indeterminate() : determinate()}
			{cancelButton()}
		</section>
	)
}
