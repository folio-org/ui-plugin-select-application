import React from 'react';
import { MemoryRouter } from 'react-router';

import { renderWithIntl } from '@folio/stripes-erm-testing';
import translationsProperties from '../../test/helpers';

import Container from './Container';

jest.mock('../View', () => () => <div>View</div>);
const onClose = jest.fn();

describe('Container', () => {
  let renderComponent;
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <MemoryRouter><Container onClose={onClose} onSelectApplication={jest.fn()} /></MemoryRouter>,
      translationsProperties
    );
  });

  it('renders View component', () => {
    const { getByText } = renderComponent;

    expect(getByText('View')).toBeInTheDocument();
  });
});





