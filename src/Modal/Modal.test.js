import React from 'react';

import {
  renderWithIntl,
  translationsProperties,
} from '@folio/stripes-erm-testing';

import { MemoryRouter } from 'react-router-dom/cjs/react-router-dom.min';
import Modal from './Modal';


jest.mock('../Container', () => ({ onLicenseSelected }) => (
  <>
    <button
      onClick={() => onLicenseSelected({}, {})}
      type="button"
    >
      <div>Select application</div>,
      <div>Container</div>
    </button>
  </>));

const onClose = jest.fn();
const open = true;

describe('Modal', () => {
  let renderComponent;

  beforeEach(() => {
    renderComponent = renderWithIntl(<MemoryRouter><Modal onClose={onClose} open={open} /></MemoryRouter>, translationsProperties);
  });

  it('renders the Container component', () => {
    const { getByText } = renderComponent;
    expect(getByText('Container')).toBeInTheDocument();
  });

  it('renders the Select application', () => {
    const { getByText } = renderComponent;
    expect(getByText('Select application')).toBeInTheDocument();
  });

  test('renders the expected heading name', () => {
    const { getByText } = renderComponent;
    expect(getByText('Select application')).toBeInTheDocument();
  });
});
