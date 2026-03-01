import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';

import { HEADER_USER_DROPDOWN_ACTIONS } from 'src/constants/common';
import { makeStore } from 'src/store';
import { i18n } from 'src/tests/i18nForTests';

import { HeaderActions } from './HeaderActions';
import common from '../../../../public/locales/en/common.json';

describe('<HeaderActionsWithSearchAndAvatar />', () => {
  beforeEach(() => {
    global.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));
  });

  it('renders the component', () => {
    const store = makeStore();

    render(
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <HeaderActions />
        </I18nextProvider>
      </Provider>,
    );

    const userAvatarBtn = screen.getByRole('button');
    fireEvent.click(userAvatarBtn);

    HEADER_USER_DROPDOWN_ACTIONS.forEach((headerUserDropdownAction) => {
      const headerUserDropdownActionTitle = new RegExp(
        common[`app_header.${headerUserDropdownAction.actionTitleI18nKey}`],
        'i',
      );
      expect(screen.getByText(headerUserDropdownActionTitle)).toBeInTheDocument();
    });

    expect(screen.getByText(/Logout/)).toBeInTheDocument();
  });
});
