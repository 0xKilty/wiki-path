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
                        <Table className="mb-7">
                            <thead>
                                <tr>
                                    <th><strong>#</strong></th>
                                    <th><strong>Title</strong></th>
                                    <th><strong>Link</strong></th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map((article, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{article}</td>
                                        <td>
                                            <a
                                                href={`https://www.wikipedia.org/wiki/${article.replace(
                                                    / /g,
                                                    "_"
                                                )}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                View Article
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Fade>
            )}
        </>
    );
}

export default Results;
