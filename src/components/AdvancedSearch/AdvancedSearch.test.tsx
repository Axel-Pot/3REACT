import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdvancedSearch from './AdvancedSearch';
import { MemoryRouter } from 'react-router-dom';
import * as SearchApi from '../../api/SearchApi';

describe('AdvancedSearch', () => {
    const mockSearch = vi.spyOn(SearchApi, 'searchAdvancedBooks');

    beforeEach(() => {
        mockSearch.mockReset();
    });

    it('affiche un message d’erreur si tous les champs sont vides', async () => {
        render(<MemoryRouter><AdvancedSearch /></MemoryRouter>);
        fireEvent.click(screen.getByText(/rechercher/i));
        expect(await screen.findByText(/veuillez remplir au moins un champ/i)).toBeInTheDocument();
    });

    it('affiche un message si aucun résultat n’est trouvé', async () => {
        mockSearch.mockResolvedValueOnce([]);
        render(<MemoryRouter><AdvancedSearch /></MemoryRouter>);

        fireEvent.change(screen.getByPlaceholderText('Titre'), { target: { value: 'Test' } });
        fireEvent.click(screen.getByText(/rechercher/i));

        await waitFor(() => {
            expect(mockSearch).toHaveBeenCalledWith({
                title: 'Test',
                author: '',
                year: '',
                subject: '',
            });
        });

        expect(await screen.findByText(/aucun résultat trouvé/i)).toBeInTheDocument();
    });

    it('affiche les résultats retournés par la recherche', async () => {
        mockSearch.mockResolvedValueOnce([
            {
                key: '/works/OL123W',
                title: 'Titre Test',
                author_name: ['Auteur Test'],
                first_publish_year: 2000,
                cover_i: 1111,
            },
        ]);

        render(<MemoryRouter><AdvancedSearch /></MemoryRouter>);

        fireEvent.change(screen.getByPlaceholderText('Auteur'), { target: { value: 'Auteur Test' } });
        fireEvent.click(screen.getByText(/rechercher/i));

        expect(await screen.findByText(/Titre Test/)).toBeInTheDocument();
        expect(screen.getByText(/Auteur Test/)).toBeInTheDocument();
        expect(screen.getByText(/2000/)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /détails/i })).toHaveAttribute('href', '/book/OL123W');
    });

    it('réinitialise les champs et les résultats', async () => {
        render(<MemoryRouter><AdvancedSearch /></MemoryRouter>);

        fireEvent.change(screen.getByPlaceholderText('Titre'), { target: { value: 'Test' } });
        fireEvent.click(screen.getByText(/réinitialiser/i));

        expect((screen.getByPlaceholderText('Titre') as HTMLInputElement).value).toBe('');
        expect(screen.queryByText(/Titre Test/)).not.toBeInTheDocument();
    });

    it('gère les erreurs d’API', async () => {
        mockSearch.mockRejectedValueOnce(new Error('Erreur serveur'));
        render(<MemoryRouter><AdvancedSearch /></MemoryRouter>);

        fireEvent.change(screen.getByPlaceholderText('Titre'), { target: { value: 'Crash' } });
        fireEvent.click(screen.getByText(/rechercher/i));

        expect(await screen.findByText(/erreur/i)).toBeInTheDocument();
        expect(screen.getByText(/Erreur serveur/i)).toBeInTheDocument();
    });
});
