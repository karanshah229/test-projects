import { withTranslation } from 'next-i18next';
import { Component, ReactNode } from 'react';

import { ErrorMessage } from 'src/components/ErrorMessage';
import { logger } from 'src/utils/logger';

type Props = {
  children?: ReactNode;
};

type State = {
  hasError: boolean;
};

class PageErrorBoundary extends Component<Props, State> {
  constructor(props) {
    super(props);

    // Define a state variable to track whether is an error or not
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error: any) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidUpdate(
    _prevProps: Readonly<Props>,
    prevState: Readonly<State>,
    _snapshot?: any,
  ): void {
    // Resets state on page switch (from page with error to other page)
    if (prevState.hasError) this.setState({ hasError: false });
  }

  componentDidCatch(error: any, errorInfo: any) {
    logger.error({ message: errorInfo, error });
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;

    if (hasError) return <ErrorMessage />;
    return children;
  }
}

export const TranslatedPageErrorBoundary = withTranslation('common')(PageErrorBoundary);
