import type { Change, Work } from "../components/RecentChanges/RecentChanges.types";
import { fetchWikipediaData } from "./wikipediaApi";
import { fetchAuthorName } from "./bookApi";
import type { BookWithAuthors } from "./bookApi";

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

                const authorNames = work.authors
                    ? await Promise.all(
                        work.authors.map(async (a) => {
                            const key = a.author?.key;
                            return key ? await fetchAuthorName(key) : "Auteur inconnu";
                        })
                    )
                    : [];

                const wikiData = await fetchWikipediaData(work.title);

                return {
                    key: work.key,
                    title: work.title,
                    description: work.description?.value,
                    created: work.created?.value,
                    authorNames,
                    coverId: work.covers?.[0] ?? undefined,
                    fallbackImageUrl: wikiData?.thumbnailUrl
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
