import { h, Component } from 'preact';

export default class Track extends Component {
	render(props, state) {
		return (
			<section className="track">
				<h4>{props.track.file}</h4>
			</section>
		);
	}
}
