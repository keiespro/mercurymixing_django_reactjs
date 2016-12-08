import { h, render } from 'preact';
import { Provider } from 'preact-redux';
import store from './store';
import App from './components/app';
import './style/main.scss';

render((
	<Provider store={store}>
		<App />
	</Provider>
), document.body);
