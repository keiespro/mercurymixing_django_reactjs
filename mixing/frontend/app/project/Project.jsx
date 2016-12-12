import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import { stateToProps, bindActions } from '../util';
import * as actions from './actions';
import TodoItem from './todo-item';

@connect(stateToProps('todos'), bindActions(actions))
export default class Project extends Component {
	addTodos = () => {
		let { text } = this.state;
		this.setState({ text: '' });
		this.props.addTodo(text);
		return false;
	};

	removeTodo = (todo) => {
		this.props.removeTodo(todo);
	};

	render({ todos }, { text }) {
		return (
			<div id="app">
				<form onSubmit={this.addTodos} action="#">
					<input value={text} onInput={this.linkState('text')} placeholder="New ToDo..." />
				</form>
				<ul>
					{ todos.map(todo => (
						<TodoItem key={todo.id} todo={todo} onRemove={this.removeTodo} />
					)) }
				</ul>
			</div>
		);
	}
}
