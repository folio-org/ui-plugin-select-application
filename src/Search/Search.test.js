import {
  renderWithIntl,
  translationsProperties,
} from '@folio/stripes-erm-testing';

import Search from './Search';

jest.mock('../Modal', () => () => <div>Modal</div>);

const renderTrigger = jest.fn();

describe('Search', () => {
  let renderComponent;
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <Search
        renderTrigger={renderTrigger}
      />,
      translationsProperties
    );
  });

  test('renders the Modal component', () => {
    const { getByText } = renderComponent;
    expect(getByText('Modal')).toBeInTheDocument();
  });

  test('should handle renderTrigger', () => {
    expect(renderTrigger).toHaveBeenCalled();
  });

  test('should use default render trigger', () => {
    const { getByTestId } = renderWithIntl(<Search />, translationsProperties);

    expect(getByTestId('default-trigger')).toBeInTheDocument();
  });
});
