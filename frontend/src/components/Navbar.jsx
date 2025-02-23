import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, Button, NavDropdown } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ACCESS_TOKEN } from "../constants"; 

const CustomNavbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Detects page changes

  useEffect(() => {
    // Re-check login status whenever the route changes
    const token = localStorage.getItem(ACCESS_TOKEN);
    setIsLoggedIn(!!token);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <Navbar expand="lg" bg="dark" variant="dark" className="shadow-sm">
      <Container>
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

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/help" className="text-white me-1">
              Help
            </Nav.Link>

            {isLoggedIn ? (
              <NavDropdown title="Profile" id="profile-dropdown">
                <NavDropdown.Item as={Link} to="/profile">My Profile</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/bookings">My Bookings</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/settings">Settings</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout} className="text-danger">
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
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
