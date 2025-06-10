import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import RecentChanges from './RecentChanges';
import * as useRecentChangesHook from './useRecentChanges';
import { MemoryRouter } from 'react-router-dom';

describe('RecentChanges', () => {
    it('affiche le message de chargement', () => {
        vi.spyOn(useRecentChangesHook, 'useRecentChanges').mockReturnValue({
            books: [],
            loading: true,
            error: null,
        });

        render(<MemoryRouter><RecentChanges /></MemoryRouter>);
        expect(screen.getByText(/chargement des livres récents/i)).toBeInTheDocument();
    });

    it('affiche un message d\'erreur', () => {
        vi.spyOn(useRecentChangesHook, 'useRecentChanges').mockReturnValue({
            books: [],
            loading: false,
            error: 'Erreur de test',
        });

        render(<MemoryRouter><RecentChanges /></MemoryRouter>);
        expect(screen.getByText(/erreur/i)).toBeInTheDocument();
        expect(screen.getByText(/Erreur de test/i)).toBeInTheDocument();
    });

    it('affiche les livres récents', () => {
        vi.spyOn(useRecentChangesHook, 'useRecentChanges').mockReturnValue({
            books: [
                {
                    key: '/works/OL1234W',
                    title: 'Mon Livre',
                    created: new Date().toISOString(),
                    authorNames: ['Auteur 1'],
                    coverId: 12345,
                    fallbackImageUrl: '',
                },
            ],
            loading: false,
            error: null,
        });

        render(<MemoryRouter><RecentChanges /></MemoryRouter>);
        expect(screen.getByText(/Mon Livre/)).toBeInTheDocument();
        expect(screen.getByText(/Auteur 1/)).toBeInTheDocument();
        expect(screen.getByRole('img')).toHaveAttribute('src', expect.stringContaining('12345'));
        expect(screen.getByRole('link', { name: /détails/i })).toHaveAttribute('href', '/book/OL1234W');
    });
});
