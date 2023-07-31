// TODO: Mongo client is being hit via getServerSideProps
// Need some way to mock this call instead of hitting database

import { render, screen, waitFor } from '../../utils/test-utils';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/router';
import Home from '../../pages/index';
import productData from '../../__mocks__/products.json';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('Home', () => {
  const products = productData.slice(0, 3);

  it('renders a heading', async () => {
    render(<Home products={products} />);
    const heading = screen.getByRole('heading', {
      name: /Products/i,
    });
    await waitFor(() => expect(heading).toBeInTheDocument());
  });

  it('renders products', async () => {
    render(<Home products={products} />);
    const productHeadings = screen.getAllByRole('heading', {
      level: 3,
    });
    await waitFor(() => expect(productHeadings).toHaveLength(3));
  });

  it('adds item to cart', async () => {
    const user = userEvent.setup();
    const push = jest.fn();
    (useRouter as jest.Mock).mockImplementation(() => ({
      push,
    }));
    render(<Home products={products} />);

    const productAddToCartButtons = screen.getAllByRole('button', {
      name: 'addtocart-btn',
    });

    await user.click(productAddToCartButtons[0]);
    expect(push).toHaveBeenCalledWith('/cart');
  });
});
