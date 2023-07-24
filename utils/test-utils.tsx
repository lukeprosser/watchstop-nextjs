import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { MockAppProviders } from '../__mocks__/mock-app-providers';

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: MockAppProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
