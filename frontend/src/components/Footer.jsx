import React from "react";
import { Container, Row, Col, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-3 mt-auto">
      <Container>
        {/* Top Row */}
        <Row className="gy-3">
          {/* Brand & Tagline */}
          <Col md={4}>
            <h5>WahooWheels</h5>
            <p className="small mb-0">Connecting UVA students for easy rides.</p>
          </Col>

          {/* Quick Links */}
          <Col md={4}>
            <h6 className="mb-2">Quick Links</h6>
            <Nav className="flex-column">
              <Nav.Link as={Link} to="/terms" className="text-light small py-0">
                Terms
              </Nav.Link>
              <Nav.Link as={Link} to="/privacy" className="text-light small py-0">
                Privacy
              </Nav.Link>
              <Nav.Link as={Link} to="/contact" className="text-light small py-0">
                Contact
              </Nav.Link>
            </Nav>
          </Col>

          {/* Social Links (Text-based) */}
          <Col md={4}>
            <h6 className="mb-2">Follow Us</h6>
            <Nav className="flex-column">
              <Nav.Link href="#" className="text-light small py-0">
                Facebook
              </Nav.Link>
              <Nav.Link href="#" className="text-light small py-0">
                Twitter
              </Nav.Link>
              <Nav.Link href="#" className="text-light small py-0">
                Instagram
              </Nav.Link>
            </Nav>
          </Col>
        </Row>

        <hr className="border-secondary my-3" />

        {/* Bottom Row */}
        <Row>
          {/* Disclaimer */}
          <Col md={8}>
            <p className="small mb-0">
              <strong>Disclaimer:</strong> Although this organization has members
              who are University of Virginia students and may have University
              employees associated or engaged in its activities and affairs, the
              organization is not a part of or an agency of the University. It is
              a separate and independent organization responsible for its own
              activities and affairs. The University does not direct, supervise,
              or control the organization and is not responsible for its
              contracts, acts, or omissions.
            </p>
          </Col>

          {/* Copyright */}
          <Col
            md={4}
            className="text-md-end text-center mt-2 mt-md-0 d-flex align-items-center justify-content-md-end"
          >
            <small>
              &copy; {new Date().getFullYear()} WahooWheels. All rights reserved.
            </small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
