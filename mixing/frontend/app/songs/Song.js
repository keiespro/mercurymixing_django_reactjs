import { h } from 'preact';
import { connect } from 'preact-redux';
import * as actions from './actions';
import {
	stateToProps, bindActions, getClassName, getStatus, deleteButton, filter
} from '../util';

import Group from '../groups/Group';
import AddGroupForm from '../groups/AddGroupForm';

function Song(props) {
	const { song, groups, removeSong } = props;
	const songGroups = filter(groups, 'song', song.id);

	return (
		<section className={getClassName(song, 'song')}>
			<h2>Song: {song.title}</h2>
			<div className="status">{getStatus(song)}</div>
			{deleteButton(song, removeSong)}
			<section className="groups">
				{songGroups.map(group => <Group key={group.key} group={group} />)}
			</section>
			<AddGroupForm song={song} />
		</section>
	);
}

export default connect(stateToProps('groups'), bindActions(actions))(Song)
