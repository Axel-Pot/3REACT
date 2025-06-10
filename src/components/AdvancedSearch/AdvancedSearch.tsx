import React, { useState } from "react";
import { searchAdvancedBooks } from "../../api/SearchApi";
import type { SearchResult } from "../../api/SearchApi";
import { Link } from "react-router-dom";
import "./AdvancedSearch.css";

const AdvancedSearch: React.FC = () => {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [year, setYear] = useState("");
    const [subject, setSubject] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title && !author && !year && !subject) {
            setError("Veuillez remplir au moins un champ.");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const res = await searchAdvancedBooks({ title, author, year, subject });
            setResults(res);
            if (res.length === 0) setError("Aucun résultat trouvé.");
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Une erreur inattendue s'est produite");
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setTitle("");
        setAuthor("");
        setYear("");
        setSubject("");
        setResults([]);
        setError(null);
    };

    return (
        <div className="advanced-container">
            <h2 className="mb-4">Recherche avancée</h2>
            <form onSubmit={handleSearch} className="row g-3">
                <div className="col-md-3">
                    <input placeholder="Titre" value={title} onChange={e => setTitle(e.target.value)} className="form-control" />
                </div>
                <div className="col-md-3">
                    <input placeholder="Auteur" value={author} onChange={e => setAuthor(e.target.value)} className="form-control" />
                </div>
                <div className="col-md-2">
                    <input placeholder="Année" value={year} onChange={e => setYear(e.target.value)} className="form-control" />
                </div>
                <div className="col-md-2">
                    <input placeholder="Sujet" value={subject} onChange={e => setSubject(e.target.value)} className="form-control" />
                </div>
                <div className="col-md-2 d-flex gap-2">
                    <button type="submit" className="btn btn-primary">Rechercher</button>
                    <button type="button" onClick={handleReset} className="btn btn-secondary">Réinitialiser</button>
                </div>
            </form>

            {loading && <p>Chargement...</p>}
            {error && <p className="text-danger">Erreur : {error}</p>}

            <div className="row mt-4">
                {results.map(book => (
                    <div key={book.key} className="col-md-6 col-lg-4 mb-4">
                        <div className="card advanced-card">
                            {book.cover_i ? (
                                <img src={`https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`} alt={book.title} className="card-img-top advanced-img" />
                            ) : (
                                <div className="card-img-top advanced-img-placeholder">
                                    Pas d'image
                                </div>
                            )}
                            <div className="card-body d-flex flex-column justify-content-between">
                                <div>
                                    <h5 className="card-title">{book.title}</h5>
                                    <p className="card-text">Auteurs : {book.author_name?.join(", ") ?? "N/A"}</p>
                                    <p className="card-text"><small>Année : {book.first_publish_year ?? "N/A"}</small></p>
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

export default AdvancedSearch;
