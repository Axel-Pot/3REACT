import { searchBooks, searchAdvancedBooks } from "./SearchApi";

describe("API searchBooks", () => {
    it("should return an array of results", async () => {
        const results = await searchBooks("harry potter");
        expect(Array.isArray(results)).toBe(true);
        if (results.length > 0) {
            expect(results[0]).toHaveProperty("key");
            expect(results[0]).toHaveProperty("title");
        }
    });
});

describe("API searchAdvancedBooks", () => {
    it("should return an array of results for advanced search", async () => {
        const results = await searchAdvancedBooks({ title: "harry potter" });
        expect(Array.isArray(results)).toBe(true);
        if (results.length > 0) {
            expect(results[0]).toHaveProperty("key");
            expect(results[0]).toHaveProperty("title");
        }
    });
});
