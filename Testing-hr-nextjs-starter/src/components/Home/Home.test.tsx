import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';

import { makeStore } from '../../store';
import Home from './Home';

describe('<Home />', () => {
  it('renders the component', () => {
    const store = makeStore();

    render(
      <Provider store={store}>
        <Home />
      </Provider>,
    );

    expect(screen.getByText(/Hello World/)).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
