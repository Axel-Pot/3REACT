import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Header.css";

const Header: React.FC = () => {
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/search?q=${encodeURIComponent(query.trim())}`);
        }
    };

    return (
        <nav className="navbar navbar-expand-lg header-navbar">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">📚 Ma Bibliothèque</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <ul className="navbar-nav me-auto d-flex flex-row gap-3">
                    <li className="nav-item">
                        <Link className="nav-link" to="/">Accueil</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/advanced-search">Recherche avancée</Link>
                    </li>
                </ul>

                <form className="d-flex search-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="form-control search-input"
                        placeholder="Recherche rapide..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button className="btn btn-light" type="submit">Rechercher</button>
                </form>
            </div>
        </nav>
    );
};

export default Header;
