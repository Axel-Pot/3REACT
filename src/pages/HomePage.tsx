import React from "react";
import RecentChanges from "../components/RecentChanges/RecentChanges";

const HomePage: React.FC = () => (
    <main style={{ padding: 20 }}>
        <h1>Modifications récentes - OpenLibrary</h1>
        <RecentChanges />
    </main>
);

export default HomePage;
