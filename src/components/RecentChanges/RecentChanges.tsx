import React from "react";
import { useRecentChanges } from "./useRecentChanges";
import { Link } from "react-router-dom";

const RecentChanges: React.FC = () => {
    const { books, loading, error } = useRecentChanges();

    if (loading) return <p>Chargement des livres récents...</p>;
    if (error) return <p>Erreur : {error}</p>;

    return (
        <div className="container my-4">
            <div className="row">
                {books.map(({ key, title, created, authorNames, coverId }) => (
                    <div key={key} className="col-md-6 col-lg-4 mb-4">
                        <div className="card h-100 shadow-sm">
                            {coverId ? (
                                <img src={`https://covers.openlibrary.org/b/id/${coverId}-L.jpg`} alt={title} className="card-img-top" />
                            ) : (
                                <div className="card-img-top bg-light d-flex align-items-center justify-content-center" style={{ height: "250px" }}>
                                    Pas d'image
                                </div>
                            )}
                            <div className="card-body">
                                <h5 className="card-title">{title}</h5>
                                <p className="card-text">Auteurs : {authorNames.length > 0 ? authorNames.join(", ") : "N/A"}</p>
                                <p className="card-text"><small>Date : {created ? new Date(created).toLocaleDateString() : "N/A"}</small></p>
                                <Link to={`/book/${key.split('/').pop()}`} className="btn btn-primary">Détails</Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentChanges;
