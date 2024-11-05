import React, { useState, useEffect } from "react";
import { Table, Row, Col, Fade, Alert } from "reactstrap";

function Progression({ articles, setResults }) {
    const [fadeIn, setFadeIn] = useState(false);
    const [pathTo, setPathTo] = useState([]);
    const [pathFrom, setPathFrom] = useState([]);

    const fetchLinks = async (url) => {
        try {
            const response = await fetch(url);
            const jsonData = await response.json();
            return jsonData;
        } catch (err) {
            console.error("Error fetching data:", err);
            return null; // Return null in case of an error
        }
    };

    const getLinksTo = async (article) => {
        const url = `https://en.wikipedia.org/w/api.php?action=query&list=backlinks&bltitle=${article}&bllimit=500&format=json&origin=*`;
        const jsonData = await fetchLinks(url);
        if (jsonData && jsonData.query && jsonData.query.backlinks) {
            return jsonData.query.backlinks
                .filter((link) => !link.title.includes(":"))
                .map((link) => link.title);
        }
        return []; // Return empty array if no valid data
    };

    const getLinksFrom = async (article) => {
        const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${article}&prop=links&pllimit=max&format=json&origin=*`;
        const jsonData = await fetchLinks(url);
        if (jsonData && jsonData.query && jsonData.query.pages) {
            const page = Object.values(jsonData.query.pages)[0];
            return page.links
                ? page.links
                      .filter((link) => !link.title.includes(":"))
                      .map((link) => link.title)
                : [];
        }
        return [];
    };

    const bidirectionalBFS = async (start, finish) => {
        const startQueue = [{ article: start, path: [start] }];
        const finishQueue = [{ article: finish, path: [finish] }];

        const startVisited = { [start]: [start] };
        const finishVisited = { [finish]: [finish] };

        while (startQueue.length > 0 && finishQueue.length > 0) {
            const path = await expandLevel(
                startQueue,
                startVisited,
                finishVisited,
                "start"
            );
            if (path) return path;

            const reversePath = await expandLevel(
                finishQueue,
                finishVisited,
                startVisited,
                "finish"
            );
            if (reversePath) return reversePath;
        }

        return null;
    };

    const expandLevel = async (queue, visited, otherVisited, direction) => {
        const { article: currentArticle, path } = queue.shift();

        const edges =
            direction === "start"
                ? await getLinksFrom(currentArticle)
                : await getLinksTo(currentArticle);
        if (edges.length === 0) {
            console.log(`${currentArticle} has no edges`);
            return null;
        }

        console.log(
            `${
                direction.charAt(0).toUpperCase() + direction.slice(1)
            } expanding:`,
            path.join(" -> "),
            `${edges.length} edges`
        );

        for (const neighbor of edges) {
            if (!visited[neighbor]) {
                const newPath = [...path, neighbor];
                visited[neighbor] = newPath;
                queue.push({ article: neighbor, path: newPath });

                if (direction === "start") {
                    setPathTo(newPath);
                } else {
                    setPathFrom(newPath);
                }

                if (otherVisited[neighbor]) {
                    return direction === "start"
                        ? newPath.concat(
                              otherVisited[neighbor].slice().reverse()
                          )
                        : otherVisited[neighbor].concat(
                              newPath.slice().reverse()
                          );
                }
            }
        }
        return null;
    };

    useEffect(() => {
        if (articles.start && articles.finish) {
            getPath(articles.start, articles.finish);
            setPathTo([]);
            setPathFrom([]);
        }
    }, [articles]);

    const getPath = async (article1, article2) => {
        const path = await bidirectionalBFS(article1, article2);
        setResults(path);
        console.log("Path found:", path ? path.join(" -> ") : "No path found.");
    };

    useEffect(() => {
        setFadeIn(articles.start && articles.finish);
    }, [articles.start, articles.finish]);

    return (
        <>
            {articles.start && articles.finish && (
                <Fade in={fadeIn} timeout={300}>
                    <Row className="mb-3">
                        <Col md={6}>
                            <TableHeader
                                header="Starting Page"
                                article={articles.start}
                            />
                        </Col>
                        <Col md={6}>
                            <TableHeader
                                header="Finishing Page"
                                article={articles.finish}
                            />
                        </Col>
                    </Row>
                    <Row className="mb-5">
                        <Col md={6}>
                            <ArticleTable path={pathTo} />
                        </Col>
                        <Col md={6}>
                            <ArticleTable path={pathFrom} />
                        </Col>
                    </Row>
                </Fade>
            )}
        </>
    );
}

function ArticleTable({ path }) {
    return (
        <Table>
            <thead>
                <tr>
                    <th>Searching</th>
                </tr>
            </thead>
            <tbody>
                {path.map((article, index) => (
                    <tr key={index}>
                        <td>{article}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}

function TableHeader({ header, article }) {
    return (
        <strong>
            {header}:{" "}
            <a
                href={`https://www.wikipedia.org/wiki/${article.replace(
                    / /g,
                    "_"
                )}`}
                target="_blank"
                rel="noreferrer"
            >
                {article}
            </a>
        </strong>
    );
}

export default Progression;
