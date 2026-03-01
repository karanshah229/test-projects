import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
// eslint-disable-next-line
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';

import { ROUTES } from 'src/constants/common';
import { rootApi } from 'src/services/common/rootApi';
import { userDetailsReducer } from 'src/slices/userDetailsSlice';
import { HRWUserDataFixture, skillUpUserDataFixture } from 'src/tests/fixtures/userDetailsFixture';
import { i18n } from 'src/tests/i18nForTests';

import { HeaderNavLinks } from './HeaderNavLinks';
import common from '../../../../public/locales/en/common.json';

describe('<HeaderNavLinks />', () => {
  it('renders the component', () => {
    const store = configureStore({
      reducer: {
        [rootApi.reducerPath]: rootApi.reducer,
        userDetails: userDetailsReducer,
      },
      preloadedState: {
        userDetails: {
          skillUpUserData: { ...skillUpUserDataFixture },
          skillUpUserProfileDataLoading: false,
          skillUpUserProfileDataError: null,
          skillUpUserProfileDataHasError: false,

          HRWUserData: { ...HRWUserDataFixture },
          HRWUserProfileDataLoading: false,
          HRWUserProfileDataError: null,
          HRWUserProfileDataHasError: false,
        },
      },
    });

    render(
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <HeaderNavLinks />
        </I18nextProvider>
      </Provider>,
    );

    ROUTES.forEach((route) => {
      if (route.appHeaderNavLinkOptions.showInHeader && route.roles_allowed.includes('admin')) {
        const navLinkText =
          common.app_header[route.appHeaderNavLinkOptions.i18nTitleKey.split('.').slice(-1)[0]];
        const navLink = new RegExp(navLinkText, 'i');

        expect(screen.getByText(navLink)).toBeInTheDocument();
      }
    });
  });
});
