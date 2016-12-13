import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import { stateToProps } from '../util';

import Song from '../songs/Song';
import AddSongForm from '../songs/AddSongForm';

@connect(stateToProps('project', 'songs'))
export default class Project extends Component {
	render(props, state) {
		const { project, songs } = props;

		return (
			<section className="project">
				<h1>Project: {project.title}</h1>
				<section className="songs">
					{songs.map(song => <Song key={song.id} song={song} />)}
					<AddSongForm />
				</section>
			</section>
		);
	}
}
