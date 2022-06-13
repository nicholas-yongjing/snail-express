import { Link } from "react-router-dom";
import React from "react";

export default function LandingPageNavbar(props) {
    return (
        <nav className="nav-bar">
            <div className="nav-bar-left">
                <Link to="/" className="logo">snail-express</Link>
                <Link to="/">Home</Link>
                <Link to="/">Features</Link>
                <Link to="/">Pricing</Link>
            </div>
            <nav className="nav-bar-right">
                <Link to="/login">Login</Link>
                <Link to="/signup">Sign Up</Link>
            </nav>
        </nav>
    );

}