import type { Work, Author } from "../components/RecentChanges/RecentChanges.types";

export interface BookWithAuthors {
    key: string;
    title: string;
    description?: string;
    created?: string;
    authorNames: string[];
    coverId?: number;
    fallbackImageUrl?: string;
}

export async function fetchAuthorName(authorKey: string): Promise<string> {
    try {
        const res = await fetch(`https://openlibrary.org${authorKey}.json`);
        if (!res.ok) return "Auteur inconnu";
        const data: Author = await res.json();
        return data.name || "Auteur inconnu";
    } catch {
        return "Auteur inconnu";
    }
}

export async function fetchBookDetails(workId: string): Promise<BookWithAuthors | null> {
    try {
        const res = await fetch(`https://openlibrary.org/works/${workId}.json`);
        if (!res.ok) return null;
        const work: Work = await res.json();

        const authorNames = work.authors
            ? await Promise.all(
                work.authors.map(async (a) => {
                    const key = a.author?.key;
                    return key ? await fetchAuthorName(key) : "Auteur inconnu";
                })
            )
            : [];

        return {
            key: work.key,
            title: work.title,
            description: work.description?.value,
            created: work.created?.value,
            authorNames,
            coverId: work.covers?.[0] ?? undefined
        };
    } catch {
        return null;
    }
}
