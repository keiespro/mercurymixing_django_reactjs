import { h, render } from 'preact';
import { Provider } from 'preact-redux';
import store from './store';
import App from './components/app';

// Hot reloading and dev tools
if (module.hot) {
	module.hot.accept();
	require('preact/devtools');
};

const rootNode = document.querySelector('#root');

render((
	<Provider store={store}>
		<App />
	</Provider>
), rootNode, rootNode.firstElementChild);
