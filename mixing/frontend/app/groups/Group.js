import { h } from 'preact';
import { connect } from 'preact-redux';
import { stateToProps } from '../util';

import Track from '../tracks/Track';

function Group(props) {
	const { group, tracks } = props;
	const groupTracks = tracks.filter(track => track.group === group.id);

	return (
		<section className="group">
			<h3>Group: {group.title}</h3>
			<section className="tracks">
				{groupTracks.map(track => <Track key={track.id} track={track} />)}
			</section>
		</section>
	);
}

export default connect(stateToProps('tracks'))(Group)
