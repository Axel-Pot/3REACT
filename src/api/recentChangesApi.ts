import type { Change, Work, Author } from "../components/RecentChanges/RecentChanges.types";

export interface BookWithAuthors {
    key: string;
    title: string;
    description?: string;
    created?: string;
    authorNames: string[];
    coverId?: number;
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

export async function fetchRecentBooks(): Promise<BookWithAuthors[]> {
    try {
        const res = await fetch(`https://openlibrary.org/recentchanges.json`);
        if (!res.ok) throw new Error(`Erreur lors de la récupération des modifications récentes : ${res.statusText}`);
        const recentChanges: Change[] = await res.json();

        const workKeys = recentChanges.flatMap(c => c.changes)
            .filter(c => c.key?.startsWith("/works/"))
            .map(c => c.key)
            .slice(0, 10);

        const books = await Promise.all(workKeys.map(async (workKey) => {
            try {
                const workRes = await fetch(`https://openlibrary.org${workKey}.json`);
                if (!workRes.ok) return null;
                const work: Work = await workRes.json();

                // Utiliser directement les noms d’auteurs
                const authorNames = work.authors?.map(a => a.author?.key?.split('/').pop() || "Auteur inconnu") ?? [];

                return {
                    key: work.key,
                    title: work.title,
                    description: work.description?.value,
                    created: work.created?.value,
                    authorNames,
                    coverId: work.covers?.[0] ?? undefined
                } as BookWithAuthors;
            } catch {
                return null;
            }
        }));

        return books.filter((b): b is BookWithAuthors => b !== null && b.key !== undefined);
    } catch (error) {
        console.error("Erreur dans fetchRecentBooks :", error);
        return [];
    }
}
