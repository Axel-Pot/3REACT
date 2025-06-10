import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { searchBooks } from "../../api/SearchApi";
import type { SearchResult } from "../../api/SearchApi";
import "./Search.css";

const SearchPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") || "";
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!query.trim()) {
            setError("Aucune requête fournie.");
            return;
        }

        setLoading(true);
        setError(null);
        searchBooks(query.trim())
            .then((res) => {
                setResults(res);
                if (res.length === 0) setError("Aucun résultat trouvé.");
            })
            .catch((e) =>
                setError(e instanceof Error ? e.message : "Erreur inconnue")
            )
            .finally(() => setLoading(false));
    }, [query]);

    return (
        <div className="container search-container">
            <h2>Résultats pour : « {query} »</h2>
            {loading && <p>Chargement...</p>}
            {error && <p className="text-danger">Erreur : {error}</p>}

            <div className="row mt-4">
                {results.map((book) => (
                    <div key={book.key} className="col-md-6 col-lg-4 mb-4">
                        <div className="card search-card">
                            {book.cover_i ? (
                                <img
                                    src={`https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`}
                                    alt={book.title}
                                    className="card-img-top search-img"
                                />
                            ) : (
                                <div className="card-img-top search-img-placeholder">
                                    Pas d'image
                                </div>
                            )}
                            <div className="card-body d-flex flex-column justify-content-between">
                                <div>
                                    <h5 className="card-title">{book.title}</h5>
                                    <p className="card-text">Auteurs : {book.author_name?.join(", ") ?? "N/A"}</p>
                                    <p className="card-text">
                                        <small>Année : {book.first_publish_year ?? "N/A"}</small>
                                    </p>
                                </div>
                                <Link to={`/book/${book.key.split("/").pop()}`} className="btn btn-primary mt-2">
                                    Détails
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchPage;
