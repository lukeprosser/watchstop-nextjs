import { render, screen } from '../../utils/test-utils';
import Footer from '../../components/Footer';

describe('Footer component', () => {
  it('renders correctly with current year', () => {
    render(<Footer />);
    const date = new Date();
    const year = date.getFullYear().toString();
    const paragraphElement = screen.getByText(`© WatchStop ${year}`);
    expect(paragraphElement).toBeInTheDocument();
  });
});
