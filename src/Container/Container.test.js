import { axe, toHaveNoViolations } from 'jest-axe';
import { MemoryRouter } from 'react-router';

import { renderWithIntl, MultiColumnList } from '@folio/stripes-erm-testing';

import translationsProperties from '../../test/helpers';

import Container from './Container';

jest.mock('../View', () => () => <div>View</div>);

jest.mock('@folio/stripes/core', () => {
  const originalModule = jest.requireActual('@folio/stripes/core');
  return { ...originalModule,
    useStripes: jest.fn().mockReturnValue({
      discovery: {
        applications: {
          'app1': { name: 'app1' },
          'app2': { name: 'app2' }
        }
      }
    }) };
});

const onClose = jest.fn();
const onSaveMock = jest.fn();
const mockCheckedAppIdsMap = {};

describe('Container', () => {
  let renderComponent;
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <MemoryRouter><Container checkedAppIdsMap={mockCheckedAppIdsMap} onClose={onClose} onSave={onSaveMock} onSelectApplication={jest.fn()} /></MemoryRouter>,
      translationsProperties
    );
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('renders View component', () => {
    const { getByText } = renderComponent;

    expect(getByText('View')).toBeInTheDocument();
  });

  it('renders expected rows', async () => {
    await MultiColumnList({ rowCount: 2 }).exists;
  });

  test('has no a11y violations according to axe', async () => {
    expect.extend(toHaveNoViolations);

    const { container } = renderComponent;
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});
