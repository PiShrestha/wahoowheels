import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, Button, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { ACCESS_TOKEN } from "../constants"; // Import the token key

const CustomNavbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is logged in based on the presence of ACCESS_TOKEN
    const token = localStorage.getItem(ACCESS_TOKEN);
    setIsLoggedIn(!!token); // If token exists, user is logged in
  }, []);

  const handleLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN); // Remove access token
    setIsLoggedIn(false);
    navigate("/login"); // Redirect to login page
  };

  return (
    <Navbar expand="lg" bg="dark" variant="dark" className="shadow-sm">
      <Container>
        {/* LEFT - Logo and About Us */}
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-4 text-white">
          WahooWheels
        </Navbar.Brand>

        <Nav className="me-auto">
          <NavDropdown title="About Us" id="about-dropdown">
            <NavDropdown.Item as={Link} to="/about">Our Mission</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/team">Meet the Team</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/faq">FAQs</NavDropdown.Item>
          </NavDropdown>
        </Nav>

        {/* Mobile Toggle Button */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        {/* RIGHT - Help & Authentication */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/help" className="text-white me-1">
              Help
            </Nav.Link>


            {isLoggedIn ? (
              // If logged in, show Profile Dropdown
              <NavDropdown title="Profile" id="profile-dropdown">
                <NavDropdown.Item as={Link} to="/profile">My Profile</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/settings">Settings</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout} className="text-danger">
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              // If NOT logged in, show Log In and Sign Up buttons
              <>
                <Button as={Link} to="/login" variant="outline-light" className="me-2">
                  Log In
                </Button>
                <Button as={Link} to="/register" variant="light" className="text-dark">
                  Sign Up
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;