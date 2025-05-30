import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

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
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">📚 Ma Bibliothèque</Link>
                {/* Le bouton toggle reste pour compatibilité responsive */}
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Ici, suppression du collapse pour que les liens soient toujours visibles */}
                <ul className="navbar-nav me-auto d-flex flex-row gap-3">
                    <li className="nav-item">
                        <Link className="nav-link" to="/">Accueil</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/advanced-search">Recherche avancée</Link>
                    </li>
                </ul>

                <form className="d-flex" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="form-control me-2"
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
