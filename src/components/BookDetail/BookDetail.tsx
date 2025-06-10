import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchWikipediaData } from "../../api/wikipediaApi";
import { fetchAuthorName } from "../../api/bookApi";
import type { WikipediaData } from "../../api/wikipediaApi";
import type { BookWithAuthors } from "../../api/bookApi";
import "./BookDetail.css";

const BookDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [book, setBook] = useState<BookWithAuthors | null>(null);
    const [wiki, setWiki] = useState<WikipediaData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        setError(null);
        setBook(null);
        setWiki(null);

        const fetchData = async () => {
            try {
                const res = await fetch(`https://openlibrary.org/works/${id}.json`);
                if (!res.ok) throw new Error("Livre introuvable");
                const data = await res.json();

                const authorNames = data.authors
                    ? await Promise.all(
                        data.authors.map(async (a: { author?: { key?: string } }) => {
                            const key = a.author?.key;
                            return key ? await fetchAuthorName(key) : "Auteur inconnu";
                        })
                    )
                    : [];

                const wikiData = await fetchWikipediaData(data.title);

                const bookData: BookWithAuthors = {
                    key: data.key,
                    title: data.title,
                    description: data.description?.value ?? undefined,
                    created: data.created?.value,
                    authorNames,
                    coverId: data.covers?.[0],
                    fallbackImageUrl: wikiData?.thumbnailUrl
                };

                setBook(bookData);
                setWiki(wikiData);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Erreur inconnue");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) return <p>Chargement...</p>;
    if (error) return <p>Erreur : {error}</p>;
    if (!book) return <p>Livre introuvable.</p>;

    return (
        <div className="book-container">
            <h1>{book.title}</h1>
            {book.coverId ? (
                <img src={`https://covers.openlibrary.org/b/id/${book.coverId}-L.jpg`} alt={book.title} className="book-image" />
            ) : book.fallbackImageUrl ? (
                <img src={book.fallbackImageUrl} alt={book.title} className="book-image" />
            ) : (
                <p>Pas d'image disponible</p>
            )}
            <p><strong>Auteurs :</strong> {book.authorNames.join(", ")}</p>
            <p><strong>Date :</strong> {book.created ? new Date(book.created).toLocaleDateString() : "N/A"}</p>
            <p><strong>Description :</strong> {book.description ?? wiki?.extract ?? "Pas de description"}</p>

            {wiki && (
                <>
                    <h2>Informations supplémentaires (Wikipedia)</h2>
                    <p>{wiki.extract}</p>
                    {wiki.thumbnailUrl && <img src={wiki.thumbnailUrl} alt={wiki.title} className="book-image" />}
                    <p><a href={wiki.pageUrl} target="_blank" rel="noreferrer">Voir sur Wikipedia</a></p>
                </>
            )}
        </div>
    );
};

export default BookDetail;
