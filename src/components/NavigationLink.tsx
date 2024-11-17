import { Link } from 'react-router-dom';

interface NavigationLinkProps {
  path: string;
  name: string;
}

const NavigationLink = ({ path, name }: NavigationLinkProps) => (
  <Link
    to={path}
    className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
  >
    {name}
  </Link>
);

export default NavigationLink;
