import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import BookDetail from './BookDetail';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import * as bookApi from '../../api/bookApi';
import * as wikipediaApi from '../../api/wikipediaApi';

global.fetch = vi.fn();

describe('BookDetail', () => {
    const mockFetch = global.fetch as unknown as ReturnType<typeof vi.fn>;
    const mockFetchAuthorName = vi.spyOn(bookApi, 'fetchAuthorName');
    const mockFetchWikipediaData = vi.spyOn(wikipediaApi, 'fetchWikipediaData');

    const renderWithRoute = (id: string) => {
        return render(
            <MemoryRouter initialEntries={[`/book/${id}`]}>
                <Routes>
                    <Route path="/book/:id" element={<BookDetail />} />
                </Routes>
            </MemoryRouter>
        );
    };

    beforeEach(() => {
        mockFetch.mockReset();
        mockFetchAuthorName.mockReset();
        mockFetchWikipediaData.mockReset();
    });

    it('affiche un message de chargement initial', () => {
        renderWithRoute('OL123W');
        expect(screen.getByText(/chargement/i)).toBeInTheDocument();
    });

    it('affiche un message d’erreur si fetch échoue', async () => {
        mockFetch.mockRejectedValueOnce(new Error('Erreur réseau'));
        renderWithRoute('OL123W');
        await waitFor(() => {
            expect(screen.getByText(/erreur/i)).toBeInTheDocument();
            expect(screen.getByText(/Erreur réseau/)).toBeInTheDocument();
        });
    });

    it('affiche les données du livre et de Wikipedia', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                key: '/works/OL123W',
                title: 'Titre Test',
                description: { value: 'Une description' },
                created: { value: '2001-01-01T00:00:00.000000' },
                authors: [{ author: { key: '/authors/A1' } }],
                covers: [1234],
            }),
        });

        mockFetchAuthorName.mockResolvedValueOnce('Auteur Test');

        mockFetchWikipediaData.mockResolvedValueOnce({
            title: 'Titre Test',
            extract: 'Extrait Wikipedia',
            pageUrl: 'https://fr.wikipedia.org/wiki/Titre_Test',
            thumbnailUrl: 'https://example.com/cover.jpg',
        });

        renderWithRoute('OL123W');

        await waitFor(() => {
            expect(screen.getByText('Titre Test')).toBeInTheDocument();
            expect(screen.getByText(/Auteur Test/)).toBeInTheDocument();
            expect(screen.getByText(/01\/01\/2001/)).toBeInTheDocument();
            expect(screen.getByText(/Une description/)).toBeInTheDocument();
            expect(screen.getByText(/Informations supplémentaires/i)).toBeInTheDocument();
            expect(screen.getByText(/Extrait Wikipedia/)).toBeInTheDocument();

            const images = screen.getAllByAltText('Titre Test');
            expect(images).toHaveLength(2);
            expect(images[0]).toHaveAttribute('src', 'https://covers.openlibrary.org/b/id/1234-L.jpg');
            expect(images[1]).toHaveAttribute('src', 'https://example.com/cover.jpg');

            expect(screen.getByRole('link', { name: /voir sur wikipedia/i })).toHaveAttribute('href', expect.stringContaining('wikipedia'));
        });
    });
});
