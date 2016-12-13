import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import { stateToProps } from '../util';

import Group from '../groups/Group';

@connect(stateToProps('groups'))
export default class Song extends Component {
	render(props, state) {
		const { song, groups } = props;
		const songGroups = groups.filter(group => group.song === song.id);

		return (
			<section className="song">
				<h2>Song: {song.title}</h2>
				<section className="groups">
					{songGroups.map(group => <Group key={group.id} group={group} />)}
				</section>
			</section>
		);
	}
}
