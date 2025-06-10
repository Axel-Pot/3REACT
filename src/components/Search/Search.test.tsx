import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import SearchPage from './Search';
import * as api from '../../api/SearchApi';

vi.mock('../../api/SearchApi');

const mockedSearchBooks = api.searchBooks as vi.MockedFunction<typeof api.searchBooks>;

function renderWithQuery(query: string) {
    return render(
        <MemoryRouter initialEntries={[`/search?q=${query}`]}>
            <Routes>
                <Route path="/search" element={<SearchPage />} />
            </Routes>
        </MemoryRouter>
    );
}

describe('SearchPage', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('affiche une erreur si la requête est vide', async () => {
        renderWithQuery('');
        expect(await screen.findByText(/aucune requête fournie/i)).toBeInTheDocument();
    });

    it('affiche le message de chargement', async () => {
        mockedSearchBooks.mockImplementation(() =>
            new Promise(() => {})
        );

        renderWithQuery('react');
        expect(screen.getByText(/chargement/i)).toBeInTheDocument();
    });

    it('affiche une erreur si API échoue', async () => {
        mockedSearchBooks.mockRejectedValue(new Error('Erreur API'));
        renderWithQuery('react');

        await waitFor(() => {
            expect(screen.getByText(/erreur : erreur api/i)).toBeInTheDocument();
        });
    });

    it('affiche un message "aucun résultat" si la liste est vide', async () => {
        mockedSearchBooks.mockResolvedValue([]);
        renderWithQuery('inconnu');

        await waitFor(() => {
            expect(screen.getByText(/aucun résultat trouvé/i)).toBeInTheDocument();
        });
    });

    it('affiche les résultats quand API réussit', async () => {
        mockedSearchBooks.mockResolvedValue([
            {
                key: '/works/OL123W',
                title: 'React pour les nuls',
                author_name: ['Jean Dupont'],
                first_publish_year: 2022,
                cover_i: 12345
            }
        ]);

        renderWithQuery('react');

        expect(await screen.findByText(/react pour les nuls/i)).toBeInTheDocument();
        expect(screen.getByText(/Jean Dupont/)).toBeInTheDocument();
        expect(screen.getByText(/2022/)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /détails/i })).toHaveAttribute('href', '/book/OL123W');
    });
});
