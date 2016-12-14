import { h } from 'preact';
import { connect } from 'preact-redux';
import { bindActions, fileSize } from '../util';
import * as actions from './actions';

function Track(props) {
	const { track } = props;

	const determinate = () => (
		<div className="determinate">
			<progress value={track.progress} />
			{track.progress > 0 ? `${(track.progress*100).toFixed(1)}%` : 'Waiting...'}
		</div>
	)

	const indeterminate = () => (
		<div className="indeterminate">
			<progress />
			Uploading...
		</div>
	)

	return (
		<section className="inprogress-track">
			{track.file.name} ({fileSize(track.file.size)})
			{track.progress === null ? indeterminate() : determinate()}
		</section>
	)
}

export default connect(null, bindActions(actions))(Track);
