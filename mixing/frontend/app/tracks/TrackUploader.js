import { h } from 'preact';
import { connect } from 'preact-redux';
import { stateToProps, bindActions } from '../util';
import * as actions from './actions';

import Dropzone from 'react-dropzone';

function TrackUploader(props) {
	const { addTrack, group, profile } = props;

	const onDrop = (acceptedFiles, rejectedFiles) => {
		acceptedFiles.forEach((file, i) => {
			if ((profile.trackCredit - i) > 0) addTrack(file, group);
		});
	}

	if (profile.trackCredit <= 0) return (
		<div className="track-uploader disabled">
			<strong>You're out of track credits</strong>
			<a href={profile.purchaseUrl}>Get more credits</a>
		</div>
	)

	return (
		<Dropzone className="track-uploader" onDrop={onDrop}>
			<div>Drop your tracks here (click to open file browser).</div>
		</Dropzone>
	);
}

export default connect(stateToProps('profile'), bindActions(actions))(TrackUploader)
