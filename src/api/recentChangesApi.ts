import type { Change, Work, Author } from "../components/RecentChanges/RecentChanges.types";

export interface BookWithAuthors {
    key: string;
    title: string;
    description?: string;
    created?: string;
    authorNames: string[];
    coverId?: number;
}

async function fetchAuthorName(authorKey: string): Promise<string> {
    const res = await fetch(`https://openlibrary.org${authorKey}.json`);
    if (!res.ok) return "Auteur inconnu";
    const data: Author = await res.json();
    return data.name || "Auteur inconnu";
}

export async function fetchRecentBooks(): Promise<BookWithAuthors[]> {
    const res = await fetch(`https://openlibrary.org/recentchanges.json`);
    if (!res.ok) throw new Error("Erreur fetch recentchanges");
    const recentChanges: Change[] = await res.json();

    const workKeys = [];
    for (const change of recentChanges) {
        for (const c of change.changes) {
            if (c.key && c.key.startsWith("/works/")) {
                workKeys.push(c.key);
                if (workKeys.length === 10) break;
            }
        }
        if (workKeys.length === 10) break;
    }

    const books = await Promise.all(workKeys.map(async (workKey) => {
        try {
            const workRes = await fetch(`https://openlibrary.org${workKey}.json`);
            if (!workRes.ok) return null;
            const work: Work = await workRes.json();

            const authorNames = work.authors
                ? await Promise.all(work.authors.map(a => fetchAuthorName(a.author.key)))
                : [];

            return {
                key: work.key,
                title: work.title,
                description: work.description?.value,
                created: work.created?.value,
                authorNames,
                coverId: work.covers ? work.covers[0] : undefined
            } as BookWithAuthors;
        } catch {
            return null;
        }
    }));

    return books.filter((b): b is BookWithAuthors => b !== null && b.key !== undefined);
}
