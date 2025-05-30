import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchWikipediaData } from "../api/wikipediaApi";
import type { WikipediaData } from "../api/wikipediaApi";
import { fetchBookDetails } from "../api/bookApi";
import type { BookWithAuthors } from "../api/recentChangesApi";

const BookDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [book, setBook] = useState<BookWithAuthors | null>(null);
    const [wiki, setWiki] = useState<WikipediaData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        setLoading(true);

        Promise.all([
            fetchBookDetails(id),
            fetchWikipediaData(id)  // On utilise id, ou remplace par book?.title si besoin
        ]).then(([bookData, wikiData]) => {
            setBook(bookData);
            setWiki(wikiData);
        }).catch(e => setError(e.message))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <p>Chargement...</p>;
    if (error) return <p>Erreur : {error}</p>;
    if (!book) return <p>Livre introuvable.</p>;

    return (
        <div style={{ padding: 20 }}>
            <h1>{book.title}</h1>
            {book.coverId ? (
                <img src={`https://covers.openlibrary.org/b/id/${book.coverId}-L.jpg`} alt={book.title} />
            ) : (
                <p>Pas d'image disponible</p>
            )}
            <p><strong>Auteurs :</strong> {book.authorNames.join(", ")}</p>
            <p><strong>Date :</strong> {book.created ? new Date(book.created).toLocaleDateString() : "N/A"}</p>
            <p><strong>Description :</strong> {book.description ?? "Pas de description"}</p>

            {wiki ? (
                <>
                    <h2>Informations supplémentaires (Wikipedia)</h2>
                    <p>{wiki.extract}</p>
                    {wiki.thumbnailUrl && <img src={wiki.thumbnailUrl} alt={wiki.title} />}
                    <p><a href={wiki.pageUrl} target="_blank" rel="noreferrer">Voir sur Wikipedia</a></p>
                </>
            ) : (
                <p>Aucune information Wikipedia trouvée.</p>
            )}
        </div>
    );
};

export default BookDetailPage;
