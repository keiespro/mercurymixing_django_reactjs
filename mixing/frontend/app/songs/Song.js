import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import { stateToProps, bindActions } from '../util';
import * as actions from './actions';

import Group from '../groups/Group';

@connect(stateToProps('groups'), bindActions(actions))
export default class Song extends Component {
	render(props, state) {
		const { song, groups, removeSong } = props;
		const songGroups = groups.filter(group => group.song === song.id);

		return (
			<section className="song">
				<h2>Song: {song.title}</h2>
				<button type="button" onClick={() => removeSong(song)}>&times;</button>
				<section className="groups">
					{songGroups.map(group => <Group key={group.id} group={group} />)}
				</section>
			</section>
		);
	}
}
