export interface WikipediaData {
    title: string;
    extract: string;
    pageUrl: string;
    thumbnailUrl?: string;
}

interface WikipediaPageData {
    pageid: number;
    ns: number;
    title: string;
    extract: string;
    thumbnail?: {
        source: string;
    };
    missing?: boolean;
}

interface WikipediaAPIResponse {
    query: {
        pages: {
            [pageId: string]: WikipediaPageData;
        };
    };
}

export async function fetchWikipediaData(searchTitle: string): Promise<WikipediaData | null> {
    const endpoint = "https://en.wikipedia.org/w/api.php";
    const params = new URLSearchParams({
        action: "query",
        prop: "extracts|pageimages",
        format: "json",
        exintro: "true",
        explaintext: "true",
        pithumbsize: "500",
        titles: searchTitle,
        origin: "*"
    });

    const url = `${endpoint}?${params.toString()}`;
    try {
        const res = await fetch(url);
        if (!res.ok) {
            console.error(`Erreur Wikipedia API : ${res.statusText}`);
            return null;
        }
        const data: WikipediaAPIResponse = await res.json();
        const pages = data.query.pages;
        const page = Object.values(pages)[0];

        if (!page || page.missing) {
            return null;
        }

        return {
            title: page.title,
            extract: page.extract,
            pageUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(page.title)}`,
            thumbnailUrl: page.thumbnail?.source
        };
    } catch (error) {
        console.error("Erreur fetch Wikipedia :", error);
        return null;
    }
}
