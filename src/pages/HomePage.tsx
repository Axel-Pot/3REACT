import React from "react";
import RecentChanges from "../components/RecentChanges/RecentChanges";

const HomePage: React.FC = () => (
    <main style={{ padding: 20 }}>
        <h1>Modifications récentes - OpenLibrary</h1>

        {/* 🔥 Bloc de test Tailwind */}
        <div className="bg-green-500 text-white p-4 rounded">
            Test TailwindCSS fonctionne !
        </div>

        <RecentChanges />
    </main>
);

export default HomePage;
