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
        <header className="flex flex-wrap justify-between items-center p-4 bg-blue-600 text-white shadow-md">
            <h1 className="text-xl font-bold">📚 Ma Bibliothèque</h1>
            <nav className="space-x-4 mt-2 sm:mt-0">
                <Link to="/" className="hover:underline">Accueil</Link>
                <Link to="/advanced-search" className="hover:underline">Recherche avancée</Link>
            </nav>
            <form onSubmit={handleSubmit} className="flex space-x-2 mt-2 sm:mt-0">
                <input
                    type="text"
                    placeholder="Recherche rapide..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="p-2 rounded text-black"
                />
                <button type="submit" className="bg-white text-blue-600 px-4 py-2 rounded">Rechercher</button>
            </form>
        </header>
    );
};

export default Header;
