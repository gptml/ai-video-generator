import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import logo from '../assets/icons/logo-svg.svg';
import { useSelector } from "react-redux";

function Header() {
  const [dropdown, setDropdown] = React.useState(null);

  const user = useSelector((state) => state.users.user);
  const location = useLocation();

  const ref = React.useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setDropdown(false)
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  return (<nav className="relative bg-gray-800">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <Link to='/'>
                <img
                  src={logo}
                  alt="Your Company"
                  className="h-8 w-auto"
                />
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                <Link
                  to='/'
                  className={`rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white  ${location.pathname === '/' ? 'bg-gray-900' : ''}`}>
                  Market
                </Link>
                <Link
                  to='/history'
                  className={`rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white  ${location.pathname === '/history' ? 'bg-gray-900' : ''}`}>
                  List
                </Link>
                {user.role === 'admin'
                  ? (<Link
                    to='/users'
                    className={`rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white  ${location.pathname === '/generation-settings' ? 'bg-gray-900' : ''}`}>
                    Users
                  </Link>)
                  : null}
                {user.role === 'admin'
                  ? (<Link
                    to='/generation-settings'
                    className={`rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white  ${location.pathname === '/generation-settings' ? 'bg-gray-900' : ''}`}>
                    Settings
                  </Link>)
                  : null}
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">


            <button
              className="relative flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              <div className="flex items-center">
                <div
                  onClick={() => setDropdown(true)}
                  className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white flex items-center justify-center text-lg font-semibold">
                  {user.name.charAt(0)}
                </div>
              </div>
            </button>

            {dropdown ? <div
              popover
              ref={ref}
              className="absolute right-0 top-20 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg outline outline-black/5 transition transition-discrete [--anchor-gap:--spacing(2)] data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in">
              <span
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                className="block px-4 py-2 text-sm text-gray-700 focus:bg-gray-100 focus:outline-hidden">
                Logout
              </span>
            </div> : null}
          </div>
        </div>
      </div>

    </nav>

  );
}

export default Header;
