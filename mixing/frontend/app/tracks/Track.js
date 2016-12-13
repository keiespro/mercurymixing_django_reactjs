import { h } from 'preact';

export default function Track(props) {
	return (
		<section className="track">
			<h4>{props.track.file}</h4>
		</section>
	);
}
