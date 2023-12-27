import React, { useEffect, useState, useRef } from 'react';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo1 from "../Images/logo2.png";

function NavbarAdmin({ onLogout }) {
  const [admin, setAdmin] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const handleDropdownToggle = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleLogout = () => {
    onLogout();
    setDropdownVisible(false);
  };

  const handleSearch = () => {
    // Find the matching route based on the search input
    const matchedRoute = findMatchingRoute(searchInput);
    // Navigate to the matched route if found
    if (matchedRoute) {
      navigate(matchedRoute);
    }
  };

  const handleSearchChange = (e) => {
    const searchText = e.target.value;
    setSearchInput(searchText);

    // Update suggestions based on the search input
    const newSuggestions = getSuggestions(searchText);
    setSuggestions(newSuggestions);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  const handleSearchIconClick = () => {
    handleSearch();
  };

  const handleSuggestionClick = (suggestion) => {
    // Navigate to the selected suggestion
    navigate(suggestion.route);
    // Clear search input and suggestions
    setSearchInput('');
    setSuggestions([]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClickOutside = (e) => {
    // Close the suggestions dropdown if the click is outside the search input and suggestions
    if (searchRef.current && !searchRef.current.contains(e.target)) {
      setSuggestions([]);
    }
  };

  // Function to find the matching route
  const findMatchingRoute = (searchText) => {
    const lowerCaseSearch = searchText.toLowerCase();
    const routes = [
      '/admindashboard', '/adminaccount', '/adminadd', '/alladmin', '/adduser', '/allusers', '/todo',
      '/addproduct', '/allproducts', '/privacypolicy', '/termsconditions', '/termsuse', '/accessibility',
      // Add other routes as needed
    ];
    for (const route of routes) {
      if (route.includes(lowerCaseSearch)) {
        return route;
      }
    }
    return null;
  };

  // Function to get suggestions based on the search input
  const getSuggestions = (searchText) => {
    const lowerCaseSearch = searchText.toLowerCase();
    const matchedSuggestions = [];

    // Filter routes based on the search input
    const routes = [
      { route: '/admindashboard', label: 'Admin Dashboard' },
      { route: '/adminaccount', label: 'Admin Account' },
      { route: '/adminadd', label: 'Add Admin' },
      { route: '/alladmin', label: 'Admin List' },
      { route: '/adduser', label: 'Add User' },
      { route: '/allusers', label: 'User List' },
      { route: '/addproduct', label: 'Add Product' },
      { route: '/allproducts', label: 'Product List' },
      { route: '/addblog', label: 'Add Blog' },
      { route: '/allblog', label: 'Blog List' },
      { route: '/todo', label: 'Todo List' },
      { route: '/privacypolicy', label: 'Privacy Policy' },
      { route: '/termsconditions', label: 'Terms and Conditions' },
      { route: '/termsuse', label: 'Terms of Use' },
      { route: '/accessibility', label: 'Accessibility' },
      // Add other routes as needed
    ];

    for (const route of routes) {
      if (route.label.toLowerCase().includes(lowerCaseSearch)) {
        matchedSuggestions.push(route);
      }
    }

    return matchedSuggestions;
  };

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      axios
        .get('http://localhost:3059/users/api/admin', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setAdmin(response.data.admin);
        })
        .catch((error) => {
          console.error('Error fetching admin information:', error);
        });
    }

    // Add a click event listener to the document body
    document.body.addEventListener('click', handleClickOutside);

    // Remove the click event listener when the component is unmounted
    return () => {
      document.body.removeEventListener('click', handleClickOutside);
    };
  }, []);


  return (
    <>
      <nav className="navbar navbar-expand-lg bg-white border shadow fixed-top mb-0">
        <div className="container-fluid d-flex align-items-center mb-0 pb-0">
          <div className="m-2 pe-2">
            <Link to="/admindashboard" >
            <img src={logo1} alt="logo1" className="logo me-5" />
            </Link>
          </div>

          <div className="d-flex align-items-center position-relative">
            {/* Search Input */}
            <form ref={searchRef} className="me-3" onSubmit={handleSearchSubmit}>
              <div className="input-group">
                <input
                  className="form-control bg-light"
                  type="text"
                  placeholder={searchInput ? '' : 'Search for...'}
                  value={searchInput}
                  onChange={handleSearchChange}
                  onKeyPress={handleKeyPress}
                />
                <span
                  className="input-group-text cursor-pointer"
                  onClick={handleSearchIconClick}
                >
                  <FontAwesomeIcon icon={faSearch} />
                </span>
              </div>

              {/* Suggestions Dropdown */}
              {suggestions.length > 0 && (
                <div className="dropdown-menu show">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion.route}
                      className="dropdown-item"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion.label}
                    </button>
                  ))}
                </div>
              )}
            </form>

            {/* Admin Dropdown */}
            <div className="dropdown">
              <img
                src={`http://localhost:3059/${admin.image}`}
                alt={`${admin.name}'s Profile`}
                className="img-thumbnail dropdown-toggle  me-3 cursor-pointer"
                style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                onClick={handleDropdownToggle}
              />
              <div
                className={`dropdown-menu dropNav mt-3 ${dropdownVisible ? 'show' : ''}`}
                aria-labelledby="dropdownMenuButton"
              >
                <Link to="/adminaccount" className="dropdown-item">
                  <span> Account</span> <FontAwesomeIcon icon={faUser} style={{ color: 'gray', marginLeft: 'auto', marginRight: '5px' }} />
                </Link>
                <button className="dropdown-item" onClick={handleLogout}>
                  Logout <FontAwesomeIcon icon={faSignOutAlt} style={{ color: 'gray', marginLeft: 'auto', marginRight: '5px' }} />
                </button>
              </div>
            </div>
            <div>
              <h4 className="font-monospace text-bold text-center me-5">
                {admin.name}
              </h4>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default NavbarAdmin;
