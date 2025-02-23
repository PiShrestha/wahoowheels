import { useState } from "react"
import api from "../api"
import { useNavigate } from "react-router-dom"
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants"
import "../styles/Form.css"
import LoadingIndicator from "./LoadingIndicator"

function FormRegister({route}) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const name = "Register";

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        try { 
            const res = await api.post(route, {username, password, email})
        //     if (method === "Register") {
        //         localStorage.setItem(ACCESS_TOKEN, res.data.access);
        //         localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        //         navigate("/");
        //     } else {
        //         navigate("/login");
        //     }
        }
        catch (error) {
            alert(error)
        } finally {
            setLoading(false)
        }
    }

    return <form onSubmit={handleSubmit} className="form-container">
        <h1 className="form-title">{"Sign up"}</h1>
        <input
            className="form-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
        />
        <input
            className="form-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
        />
        <input
            className="form-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
        />
        {loading && <LoadingIndicator/>}
        <button className="form-button" type="submit">
            {"Submit"}
        </button>
    </form>
}

export default FormRegister