import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // ✅ Updated hook

const Login = (props) => {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const navigate = useNavigate();  // ✅ useNavigate instead of useHistory

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: credentials.email, password: credentials.password })
        });

        const json = await response.json();
        console.log(json);

        if (json.success) {
            // Save the auth token and redirect
            localStorage.setItem('token', json.authtoken);
            props.showAlert("Logged in successfully", "success");
            navigate("/");  // ✅ use navigate instead of history.push
        } else {
            props.showAlert("Invalid details", "danger");
        }
    };

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    return (

        <div className="container mt-3">
            <h2>Login to continue to iNOTEBOOK </h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input
                        type="email"
                        className="form-control"
                        name="email"
                        id="email"
                        value={credentials.email}
                        onChange={onChange}
                        aria-describedby="emailHelp"
                        required
                    />
                    <div id="emailHelp" className="form-text">We'll never share your email.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        name="password"
                        id="password"
                        value={credentials.password}
                        onChange={onChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
};

export default Login;
