import React from "react";
import { useRecentChanges } from "./useRecentChanges";
import "./RecentChanges.css";

const RecentChanges: React.FC = () => {
    const { books, loading, error } = useRecentChanges();

    if (loading) return <p>Chargement des livres récents...</p>;
    if (error) return <p>Erreur : {error}</p>;

    return (
        <div className="book-list">
            {books.map(({ key, title, created, authorNames, coverId }) => (
                <div key={key} className="book-card">
                    {coverId ? (
                        <img
                            src={`https://covers.openlibrary.org/b/id/${coverId}-L.jpg`}
                            alt={`Couverture de ${title}`}
                            className="book-cover"
                        />
                    ) : (
                        <div className="book-cover-placeholder">Pas d'image</div>
                    )}
                    <div className="book-info">
                        <h3>{title}</h3>
                        <p><strong>Auteurs :</strong> {authorNames.length > 0 ? authorNames.join(", ") : "N/A"}</p>
                        <p><strong>Date :</strong> {created ? new Date(created).toLocaleDateString() : "N/A"}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default RecentChanges;
