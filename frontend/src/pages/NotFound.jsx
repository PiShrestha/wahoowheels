import { Link } from "react-router-dom";
import "../styles/NotFound.css";

function NotFound() {
  return (
    <div className="not-found-container">
      <h1>404 - Page Not Found</h1>
      <h2>We are sorry to say that this page is still in development due to extensive time and personal restrictions</h2>
      <h2>Please check back at future time for updates</h2>
      <Link to="/" className="home-button">Go to Homepage</Link>
    </div>
  );
}

export default NotFound;
