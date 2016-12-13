import { h } from 'preact';
import { connect } from 'preact-redux';
import { bindActions } from '../util';
import * as actions from './actions';

import Dropzone from 'react-dropzone';

function TrackUploader(props) {
	const onDrop = (acceptedFiles, rejectedFiles) => {
      acceptedFiles.forEach(file => props.addTrack(file, props.group));
    }

	return (
		<Dropzone onDrop={onDrop}>
			<div>Drop your files here (click to open file browser).</div>
		</Dropzone>
	);
}

export default connect(null, bindActions(actions))(TrackUploader)
