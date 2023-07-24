import { render, screen, act, waitFor } from '../../utils/test-utils';
import Account from '../../pages/account';
import { useRouter } from 'next/router';
// import { useStore } from '../../hooks/useStore';
import preloadAll from 'jest-next-dynamic';

beforeAll(async () => {
  await preloadAll();
});

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// jest.mock('../../hooks/useStore', () => ({
//   useStore: jest.fn(),
// }));

// jest.mock('../../hooks/useStore', () => ({
//   name: 'Test',
//   email: 'test@test.com',
// }));

jest.mock('../../hooks/useStore', () => ({
  __esModule: true,
  default: () => ({
    state: {
      userInfo: { name: 'Test', email: 'test@test.com' },
      cart: { cartItems: [] },
    },
  }),
}));

// file:///Users/lukeprosser/Documents/coding/projects/watchstop-nextjs/coverage/lcov-report/account.tsx.html
// https://polvara.me/posts/mocking-context-with-react-testing-library

describe('Account page', () => {
  // it('redirects to login page when user not found', async () => {
  //   const push = jest.fn();
  //   (useRouter as jest.Mock).mockImplementation(() => ({
  //     push,
  //   }));
  //   render(<Account />);
  //   await waitFor(() => expect(push).toHaveBeenCalledWith('/login'));
  // });

  it('renders a heading', async () => {
    // (useStore as jest.Mock).mockImplementation(() => ({
    //   name: 'Test',
    //   email: 'test@test.com',
    // }));
    act(() => {
      render(<Account />);
    });
    const heading = screen.getByRole('heading', { name: /Account/i });
    await waitFor(() => expect(heading).toBeInTheDocument());
  });
});
