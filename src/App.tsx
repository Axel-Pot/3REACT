import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BookDetailPage from './pages/BookDetailPage';
import SearchPage from './pages/SearchPage';
import Header from './components/Header/Header';
import AdvancedSearchPage from './pages/AdvancedSearchPage';

function App() {
    return (
        <>
            <Header />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/book/:id" element={<BookDetailPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/advanced-search" element={<AdvancedSearchPage />} /> {/* Ajout */}
            </Routes>
        </>
    );
}


export default App;
