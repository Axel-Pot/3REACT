import type { Work } from "../components/RecentChanges/RecentChanges.types";
import type { BookWithAuthors } from "./recentChangesApi";

export async function fetchBookDetails(workId: string): Promise<BookWithAuthors | null> {
    try {
        const res = await fetch(`https://openlibrary.org/works/${workId}.json`);
        if (!res.ok) return null;
        const work: Work = await res.json();

        const authorNames = work.authors?.map(a => a.author?.key?.split('/').pop() ?? "Auteur inconnu") ?? [];

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
