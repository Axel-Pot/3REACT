import React, { useState } from "react";
import { searchAdvancedBooks } from "../api/SearchApi";
import type { SearchResult } from "../api/SearchApi";
import { Link } from "react-router-dom";

const AdvancedSearchPage: React.FC = () => {
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
        } catch (e: Error | unknown) {
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
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Recherche avancée</h2>
            <form onSubmit={handleSearch} className="flex flex-col gap-2 mb-4 max-w-md">
                <input placeholder="Titre" value={title} onChange={e => setTitle(e.target.value)} className="border p-2 rounded" />
                <input placeholder="Auteur" value={author} onChange={e => setAuthor(e.target.value)} className="border p-2 rounded" />
                <input placeholder="Année" value={year} onChange={e => setYear(e.target.value.replace(/\D/g, ""))} className="border p-2 rounded" />
                <input placeholder="Sujet" value={subject} onChange={e => setSubject(e.target.value)} className="border p-2 rounded" />
                <div className="flex gap-2">
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Rechercher</button>
                    <button type="button" onClick={handleReset} className="bg-gray-300 text-black px-4 py-2 rounded">Réinitialiser</button>
                </div>
            </form>

            {loading && <p>Chargement...</p>}
            {error && <p className="text-red-600">Erreur : {error}</p>}
            {results.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {results.map(book => (
                        <Link to={`/book/${book.key.split('/').pop()}`} key={book.key} className="border rounded shadow hover:shadow-lg transition">
                            {book.cover_i ? (
                                <img src={`https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`} alt={book.title} className="w-full h-60 object-cover" />
                            ) : (
                                <div className="w-full h-60 flex items-center justify-center bg-gray-200">Pas d'image</div>
                            )}
                            <div className="p-2">
                                <h3 className="font-bold">{book.title}</h3>
                                <p>Auteurs : {book.author_name?.join(", ") ?? "N/A"}</p>
                                <p>Année : {book.first_publish_year ?? "N/A"}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdvancedSearchPage;
