import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { searchBooks } from "../api/SearchApi";
import type { SearchResult } from "../api/SearchApi";

const SearchPage: React.FC = () => {
    const query = new URLSearchParams(useLocation().search).get("q") ?? "";
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!query) {
            setResults([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        searchBooks(query)
            .then(setResults)
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    }, [query]);

    if (loading) return <p>Chargement des résultats...</p>;
    if (error) return <p>Erreur : {error}</p>;
    if (results.length === 0) return <p>Aucun résultat trouvé pour "{query}".</p>;

    return (
        <div style={{ padding: 20 }}>
            <h2>Résultats pour "{query}"</h2>
            <div className="book-list">
                {results.map(book => (
                    <Link to={`/book/${book.key.split('/').pop()}`} key={book.key} className="book-card">
                        {book.cover_i ? (
                            <img
                                src={`https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`}
                                alt={book.title}
                                onError={(e) => (e.currentTarget.src = "/default-cover.jpg")}
                                className="book-cover"
                            />
                        ) : (
                            <img src="/default-cover.jpg" alt="Default Cover" className="book-cover" />
                        )}
                        <div className="book-info">
                            <h3>{book.title}</h3>
                            <p><strong>Auteurs :</strong> {book.author_name?.join(", ") ?? "N/A"}</p>
                            <p><strong>Année :</strong> {book.first_publish_year ?? "N/A"}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default SearchPage;
