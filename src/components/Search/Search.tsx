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

    const [currentPage, setCurrentPage] = useState(1);
    const booksPerPage = 9;

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

    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    const currentBooks = results.slice(indexOfFirstBook, indexOfLastBook);

    const handlePageChange = (pageNumber: number) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        if (value > 0 && value <= totalPages) {
            setCurrentPage(value);
        }
    };

    const totalPages = Math.ceil(results.length / booksPerPage);

    return (
        <div className="container search-container">
            <h2>Résultats pour : « {query} »</h2>
            {loading && <div className="loader">Chargement...</div>}
            {error && <p className="text-danger error-message">{error}</p>}

            <div className="row mt-4">
                {currentBooks.map((book) => (
                    <div key={book.key} className="col-md-6 col-lg-4 mb-4">
                        <div className="card search-card shadow-sm">
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
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title">{book.title}</h5>
                                <p className="card-text">Auteurs : {book.author_name?.join(", ") ?? "N/A"}</p>
                                <p className="card-text">
                                    <small>Année : {book.first_publish_year ?? "N/A"}</small>
                                </p>
                                <Link to={`/book/${book.key.split("/").pop()}`} className="btn btn-primary mt-2">
                                    Détails
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="pagination-container">
                <button
                    className="pagination-btn"
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                >
                    &laquo;&laquo; Première
                </button>
                <button
                    className="pagination-btn"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    &lt; Précédente
                </button>
                <span className="current-page">
                    Page {currentPage} sur {totalPages}
                </span>
                <button
                    className="pagination-btn"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Suivante &gt;
                </button>
                <button
                    className="pagination-btn"
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                >
                    Dernière &raquo;&raquo;
                </button>
                <div className="page-select">
                    <input
                        type="number"
                        value={currentPage}
                        onChange={handlePageInputChange}
                        min="1"
                        max={totalPages}
                    />
                </div>
            </div>
        </div>
    );
};

export default SearchPage;
