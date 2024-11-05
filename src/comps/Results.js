import React, { useEffect, useState } from "react";
import { Fade, Table } from "reactstrap";

function Results({ results }) {
    const [fadeIn, setFadeIn] = useState(false);
    useEffect(() => {
        setFadeIn(results && results.length !== 0);
    }, [results]);

    return (
        <>
            {results && results.length !== 0 && (
                <Fade in={fadeIn} timeout={300}>
                    <div>
                        <h3>Results</h3>
                        <ResultsTable results={results} />
                    </div>
                    <ResultsFooter />
                </Fade>
            )}
        </>
    );
}

function ResultsTable({ results }) {
    return (
        <Table className="mb-7">
            <thead>
                <ResultsTableHeader />
            </thead>
            <tbody>
                <ResultsTableBody results={results} />
            </tbody>
        </Table>
    );
}

function ResultsTableHeader() {
    return (
        <tr>
            <th>
                <strong>#</strong>
            </th>
            <th>
                <strong>Title</strong>
            </th>
            <th>
                <strong>Link</strong>
            </th>
        </tr>
    );
}

function ResultsTableBody({ results }) {
    return (
        <>
            {results.map((article, index) => (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{article}</td>
                    <td>
                        <a href={`https://www.wikipedia.org/wiki/${article.replace(/ /g, "_")}`} target="_blank" rel="noopener noreferrer">
                            View Article
                        </a>
                    </td>
                </tr>
            ))}
        </>
    );
}

function ResultsFooter() {
    return (
        <div className="footer">
            Please consider{" "}
            <a href="https://donate.wikimedia.org/wiki/Ways_to_Give" target="_blank" rel="noopener noreferrer">donating</a>
            {" "}to Wikipedia!
        </div>
    );
}

export default Results;
