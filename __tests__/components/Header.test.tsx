import { render, screen, within } from '../../utils/test-utils';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import { IUser } from '../../constants';

let userInfo: IUser | null = null;

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../../hooks/useStore', () => ({
  __esModule: true,
  default: () => ({
    state: {
      userInfo: userInfo,
      cart: { cartItems: [], deliveryInfo: {}, paymentMethod: 'PayPal' },
    },
    dispatch: jest.fn(),
  }),
}));

describe('Header component', () => {
  it('renders logo', () => {
    render(<Header />);
    const logoElement = screen.getByRole('link', { name: /watchst p/i }); // need better matcher
    expect(logoElement).toBeInTheDocument();
  });

  it('renders menu close button when menu open button clicked', async () => {
    const user = userEvent.setup();
    render(<Header />);
    const banner = screen.getByRole('banner');
    const hamburgerBtn = within(banner).getByRole('button', {
      name: 'hamburger-btn',
    });

    await user.click(hamburgerBtn);

    const closeBtn = within(banner).getByRole('button', {
      name: 'close-btn',
    });
    expect(closeBtn).toBeInTheDocument();
  });

  it('hides mobile menu when close icon clicked', async () => {
    const user = userEvent.setup();
    render(<Header />);
    const banner = screen.getByRole('banner');
    const hamburgerBtn = within(banner).getByRole('button', {
      hidden: true,
    });

    await user.click(hamburgerBtn);

    const closeBtn = within(banner).getByRole('button', {
      name: 'close-btn',
    });

    await user.click(closeBtn);
    expect(hamburgerBtn).toBeInTheDocument();
  });

  it('renders account options button when user logged in', () => {
    userInfo = {
      name: 'Test',
      email: 'test@test.com',
      admin: true,
      _id: '123',
    };
    render(<Header />);
    const banner = screen.getByRole('banner');
    const accountMenuBtn = within(banner).getByRole('button', {
      name: /test/i,
    });

    expect(accountMenuBtn).toBeInTheDocument();
  });

  it('renders account options when logged in user clicks name', async () => {
    const user = userEvent.setup();
    userInfo = {
      name: 'Test',
      email: 'test@test.com',
      admin: true,
      _id: '123',
    };
    render(<Header />);
    const banner = screen.getByRole('banner');
    const accountMenuBtn = within(banner).getByRole('button', {
      name: /test/i,
    });

    await user.click(accountMenuBtn);
    const accountMenuNav = within(banner).getByRole('list', {
      name: 'account-menu-nav',
    });
    const accountMenu = accountMenuNav.parentElement;
    expect(accountMenu).toHaveClass('scale-100');
  });

  it('redirects user when logout button clicked', async () => {
    const user = userEvent.setup();
    userInfo = {
      name: 'Test',
      email: 'test@test.com',
      admin: true,
      _id: '123',
    };
    const push = jest.fn();
    (useRouter as jest.Mock).mockImplementation(() => ({
      push,
    }));
    render(<Header />);
    const banner = screen.getByRole('banner');
    const logoutBtn = within(banner).getByRole('button', {
      name: /logout/i,
    });

    await user.click(logoutBtn);
    expect(push).toHaveBeenCalledWith('/');
  });
});
