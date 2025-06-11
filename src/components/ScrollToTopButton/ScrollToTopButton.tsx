import React, { useEffect, useState } from "react";
import "./ScrollToTopButton.css";

const ScrollToTopButton: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > 200);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <button
            className={`scroll-to-top ${isVisible ? "visible" : ""}`}
            onClick={scrollToTop}
            aria-label="Revenir en haut"
        >
            ↑
        </button>
    );
};

export default ScrollToTopButton;
