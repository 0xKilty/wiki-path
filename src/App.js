import "./App.css";
import React, { useState } from "react";
import Header from "./comps/Header";
import ArticleInput from "./comps/ArticleInput";
import Progression from "./comps/Progression";
import Results from "./comps/Results";

function App() {
    const [articles, setArticles] = useState({
        start: null,
        finish: null,
    });

    const [results, setResults] = useState();

    return (
        <>
            <div className="main center">
                <Header />
                <ArticleInput setArticles={setArticles} setResults={setResults} />
            </div>
            <div className="main">
                <Progression articles={articles} setResults={setResults} />
                <Results results={results} />
            </div>
        </>
    );
}

export default App;
