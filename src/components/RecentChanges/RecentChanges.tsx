import React from "react";
import { useRecentChanges } from "./useRecentChanges";
import { Link } from "react-router-dom";

const RecentChanges: React.FC = () => {
    const { books, loading, error } = useRecentChanges();

    if (loading) return <p>Chargement des livres récents...</p>;
    if (error) return <p>Erreur : {error}</p>;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
            {books.map(({ key, title, created, authorNames, coverId }) => (
                <Link
                    to={`/book/${key.split('/').pop()}`}
                    key={key}
                    className="border rounded shadow hover:shadow-lg transition"
                >
                    {coverId ? (
                        <img
                            src={`https://covers.openlibrary.org/b/id/${coverId}-L.jpg`}
                            alt={`Couverture de ${title}`}
                            className="w-full h-60 object-cover"
                            onError={(e) => { e.currentTarget.src = '/default-cover.jpg'; }}
                        />
                    ) : (
                        <div className="w-full h-60 flex items-center justify-center bg-gray-200">
                            Pas d'image
                        </div>
                    )}
                    <div className="p-2">
                        <h3 className="font-bold">{title}</h3>
                        <p>Auteurs : {authorNames.length > 0 ? authorNames.join(", ") : "N/A"}</p>
                        <p>Date : {created ? new Date(created).toLocaleDateString() : "N/A"}</p>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default RecentChanges;
