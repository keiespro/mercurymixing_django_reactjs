import { h, render } from 'preact';
import { Provider } from 'preact-redux';
import store from './store';
import App from './components/app';

if (module.hot) require('preact/devtools');

render((
	<Provider store={store}>
		<App />
	</Provider>
), document.querySelector('#root'));
