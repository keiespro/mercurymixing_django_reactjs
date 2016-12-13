import { h } from 'preact';
import { connect } from 'preact-redux';
import { bindActions } from '../util';
import * as actions from './actions';

 function Track(props) {
	return (
		<section className="inprogress-track">
			Uploading: {props.track.file.name}...
		</section>
	)
}

export default connect(null, bindActions(actions))(Track);
