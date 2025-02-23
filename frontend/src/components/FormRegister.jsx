import { useState } from "react"
import api from "../api"
import { useNavigate } from "react-router-dom"
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants"
import "../styles/Form.css"
import LoadingIndicator from "./LoadingIndicator"

function FormRegister({ route }) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({}) // For storing validation errors
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        setLoading(true);
    e.preventDefault();

    setErrors({});

    let formIsValid = true;
    const newErrors = {};

    // Validate email
    if (!email.endsWith("@virginia.edu")) {
        formIsValid = false;
        newErrors.email = "Please use a Virginia email address.";
    }

    // Validate username
    if (username === "") {
        formIsValid = false;
        newErrors.username = "Please enter a Username";
    }

    // Validate password
    if (password === "") {
        formIsValid = false;
        newErrors.password = "Please enter a password"; // Corrected this line
    }

    // If there are any validation errors, set them and stop the form submission
    if (!formIsValid) {
        setErrors(newErrors);
        setLoading(false);
        return;
    }

        try {
            const res = await api.post(route, { username, password, email })
            if (res.data.access && res.data.refresh) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh)
                navigate("/")
            } else {
            }
        } catch (error) {
        } finally {
            setLoading(false)
            alert("Please check email for verification")
        }
    }

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h1 className="form-title">Sign up</h1>
            <input
                className="form-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
            />
            <div style={{ color: "red", fontSize: "12px" }}>
                {errors.username && errors.username}
            </div>

            <input
                className="form-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
            />
            <div style={{ color: "red", fontSize: "12px" }}>
                {errors.email && errors.email}
            </div>

            <input
                className="form-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            <div style={{ color: "red", fontSize: "12px" }}>
                {errors.password && errors.password}
            </div>

            {/* Show general error if any */}
            {errors.general && <div style={{ color: "red", fontSize: "12px" }}>{errors.general}</div>}

            {loading && <LoadingIndicator />}
            <button className="form-button" type="submit">
                Submit
            </button>
        </form>
    )
}

export default FormRegister
