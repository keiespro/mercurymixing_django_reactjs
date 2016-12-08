import { render, h } from 'preact';
import App from './App';

/** @jsx h */
it('renders without crashing', () => {
  const div = document.createElement('div');
  render(<App />, div);
});
