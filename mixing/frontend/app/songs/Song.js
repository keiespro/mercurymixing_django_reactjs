import { h } from 'preact';
import { connect } from 'preact-redux';
import { stateToProps, bindActions } from '../util';
import * as actions from './actions';

import Group from '../groups/Group';
import AddGroupForm from '../groups/AddGroupForm';

function Song(props) {
	const { song, groups, removeSong } = props;
	const songGroups = groups.filter(group => group.song === song.id);

	return (
		<section className="song">
			<h2>Song: {song.title}</h2>
			<button onClick={() => removeSong(song)}>&times;</button>
			<section className="groups">
				{songGroups.map(group => <Group key={group.key} group={group} />)}
			</section>
			<AddGroupForm song={song} />
		</section>
	);
}

export default connect(stateToProps('groups'), bindActions(actions))(Song)
