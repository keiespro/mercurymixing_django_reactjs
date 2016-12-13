import fetchival from 'fetchival';
import Cookies from 'js-cookie';

const api = fetchival('/api', {
	credentials: 'same-origin',
	headers: {
		'X-CSRFToken': Cookies.get('csrftoken'),
		'Accept': 'application/json',
		'Content-Type': 'application/json'
	}
});

export default api;
