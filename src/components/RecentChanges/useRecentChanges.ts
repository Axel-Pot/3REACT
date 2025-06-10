import { useEffect, useState } from "react";
import { fetchRecentBooks } from "../../api/recentChangesApi";
import type {BookWithAuthors} from "../../api/bookApi.ts";

export function useRecentChanges() {
    const [books, setBooks] = useState<BookWithAuthors[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchRecentBooks()
            .then(setBooks)
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    return { books, loading, error };
}
