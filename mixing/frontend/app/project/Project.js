import { h } from 'preact';
import { connect } from 'preact-redux';
import { stateToProps } from '../util';

import Song from '../songs/Song';
import AddSongForm from '../songs/AddSongForm';
import Comment from '../comments/Comment';
import AddCommentForm from '../comments/AddCommentForm';

function Project(props) {
	const { project, profile, songs, comments } = props;

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
			<section className="comments">
				<h2>Comments {comments.length}</h2>
				{comments.map(cmt => <Comment key={cmt.key} comment={cmt} />)}
			</section>
			<AddCommentForm project={project} />
		</section>
	);
}

export default connect(stateToProps('project', 'profile', 'songs', 'comments'))(Project)
