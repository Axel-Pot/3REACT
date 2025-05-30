
import { render, screen, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import RecentChanges from "./RecentChanges";
import * as api from "../../api/recentChangesApi";

jest.mock("../../api/recentChangesApi");

describe("RecentChanges component", () => {
    it("should show loading state initially", async () => {
        (api.fetchRecentBooks as jest.Mock).mockResolvedValue([]);
        render(<RecentChanges />);
        expect(screen.getByText(/chargement des livres récents/i)).toBeInTheDocument();
        await waitFor(() => {
            expect(api.fetchRecentBooks).toHaveBeenCalled();
        });
    });

    it("should show error message on error", async () => {
        (api.fetchRecentBooks as jest.Mock).mockRejectedValue(new Error("Erreur API"));
        render(<RecentChanges />);
        await waitFor(() => {
            expect(screen.getByText(/erreur/i)).toBeInTheDocument();
        });
    });
});
