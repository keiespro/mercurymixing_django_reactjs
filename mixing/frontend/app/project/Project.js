import { h } from 'preact';
import { connect } from 'preact-redux';
import { stateToProps } from '../util';

import Song from '../songs/Song';
import AddSongForm from '../songs/AddSongForm';

function Project(props) {
	const { project, songs, profile } = props;

	return (
		<section className="project">
			<h1>Project: {project.title}</h1>
			<ul className="profile-meta">
				<li>Available track credits: <span>{profile.trackCredit}</span></li>
				<li><a href={profile.purchaseUrl}>Get more credits</a></li>
			</ul>
			<section className="songs">
				{songs.map(song => <Song key={song.key} song={song} />)}
			</section>
			<AddSongForm project={project} />
		</section>
	);
}

export default connect(stateToProps('project', 'profile', 'songs'))(Project)