import React from "react";
import { useRecentChanges } from "./useRecentChanges";
import { Link } from "react-router-dom";
import "./RecentChanges.css";

const RecentChanges: React.FC = () => {
    const { books, loading, error } = useRecentChanges();

    if (loading) return <p>Chargement des livres récents...</p>;
    if (error) return <p>Erreur : {error}</p>;

    return (
        <div className="container recent-container">
            <div className="row">
                {books.map(({ key, title, created, authorNames, coverId, fallbackImageUrl }) => (
                    <div key={key} className="col-md-6 col-lg-4 mb-4">
                        <div className="card recent-card">
                            {coverId ? (
                                <img
                                    src={`https://covers.openlibrary.org/b/id/${coverId}-L.jpg`}
                                    alt={title}
                                    className="card-img-top recent-img"
                                />
                            ) : fallbackImageUrl ? (
                                <img
                                    src={fallbackImageUrl}
                                    alt={title}
                                    className="card-img-top recent-img"
                                />
                            ) : (
                                <div className="card-img-top recent-img-placeholder">
                                    Pas d'image
                                </div>
                            )}
                            <div className="card-body d-flex flex-column justify-content-between">
                                <div>
                                    <h5 className="card-title">{title}</h5>
                                    <p className="card-text">
                                        Auteurs : {authorNames.length > 0 ? authorNames.join(", ") : "N/A"}
                                    </p>
                                    <p className="card-text">
                                        <small>
                                            Date : {created ? new Date(created).toLocaleDateString() : "N/A"}
                                        </small>
                                    </p>
                                </div>
                                <Link to={`/book/${key.split("/").pop()}`} className="btn btn-primary mt-2">
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

export default RecentChanges;