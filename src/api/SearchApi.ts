export interface SearchResult {
    key: string;
    title: string;
    author_name?: string[];
    first_publish_year?: number;
    cover_i?: number;
}

interface OpenLibraryDoc {
    key: string;
    title: string;
    author_name?: string[];
    first_publish_year?: number;
    cover_i?: number;
}

export async function searchBooks(query: string): Promise<SearchResult[]> {
    try {
        const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error(`Erreur lors de la recherche : ${res.statusText}`);
        const data = await res.json();

        return data.docs.map((doc: OpenLibraryDoc) => ({
            key: doc.key,
            title: doc.title,
            author_name: doc.author_name,
            first_publish_year: doc.first_publish_year,
            cover_i: doc.cover_i
        }));
    } catch (error) {
        console.error("Erreur dans searchBooks :", error);
        return [];
    }
}

export async function searchAdvancedBooks(params: { title?: string; author?: string; year?: string; subject?: string; }): Promise<SearchResult[]> {
    const queryParts = [];
    if (params.title) queryParts.push(`title=${encodeURIComponent(params.title)}`);
    if (params.author) queryParts.push(`author=${encodeURIComponent(params.author)}`);
    if (params.year) queryParts.push(`first_publish_year=${encodeURIComponent(params.year)}`);
    if (params.subject) queryParts.push(`subject=${encodeURIComponent(params.subject)}`);
    const queryString = queryParts.join("&");

    try {
        const res = await fetch(`https://openlibrary.org/search.json?${queryString}`);
        if (!res.ok) throw new Error(`Erreur recherche avancée : ${res.statusText}`);
        const data = await res.json();

        return data.docs.map((doc: OpenLibraryDoc) => ({
            key: doc.key,
            title: doc.title,
            author_name: doc.author_name,
            first_publish_year: doc.first_publish_year,
            cover_i: doc.cover_i
        }));
    } catch (error) {
        console.error("Erreur dans searchAdvancedBooks :", error);
        return [];
    }
}


