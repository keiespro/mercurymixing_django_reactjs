import { h } from 'preact';
import { connect } from 'preact-redux';
import * as actions from './actions';
import {
	stateToProps, bindActions, getClassName, getStatus, deleteButton, filter
} from '../util';

import Track from '../tracks/Track';
import TrackUploader from '../tracks/TrackUploader';

function Group(props) {
	const { group, tracks, removeGroup } = props;
	const groupTracks = filter(tracks, 'group', group.id);

	return (
		<section className={getClassName(group, 'group')}>
			<h3>Group: {group.title}</h3>
			<div className="status">{getStatus(group)}</div>
			{deleteButton(group, removeGroup)}
			<section className="tracks">
				{groupTracks.map(track => <Track key={track.key} track={track} />)}
			</section>
			<TrackUploader group={group} />
		</section>
	);
}

export default connect(stateToProps('tracks'), bindActions(actions))(Group)
