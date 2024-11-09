import React, { useState } from "react";
import { Button, Row, Col } from "reactstrap";
import { IoShuffle, IoSearch } from "react-icons/io5";
import { HiOutlineSwitchHorizontal } from "react-icons/hi";
import { Autocomplete, TextField } from "@mui/material";

function ArticleInput({ setArticles, setResults }) {
    const [startingArticle, setStartingArticle] = useState("");
    const [finishingArticle, setFinishingArticle] = useState("");

    const handleRandom = async (setter) => {
        const randomUrl =
            "https://en.wikipedia.org/w/api.php?action=query&list=random&rnlimit=1&rnnamespace=0&format=json&origin=*";
        try {
            const response = await fetch(randomUrl);
            const jsonData = await response.json();
            const articleTitle = jsonData.query.random[0].title;
            setter(articleTitle);
        } catch (err) {
            console.error("Error fetching random article:", err);
        }
    };

    const handleSwitch = () => {
        setStartingArticle((prev) => {
            const temp = finishingArticle;
            setFinishingArticle(prev);
            return temp;
        });
    };

    const handleGo = () => {
        setArticles({
            start: startingArticle,
            finish: finishingArticle,
        });
        setResults([]);
    };

    return (
        <>
            <Row className="mb-5">
                <Col md={5}>
                    <ArticleSelector
                        articleTitle={startingArticle}
                        setArticleTitle={setStartingArticle}
                        handleRandom={() => handleRandom(setStartingArticle)}
                    />
                </Col>
                <Col
                    md={2}
                    className="d-flex align-items-center justify-content-center"
                >
                    <SwitchButton handleSwitch={handleSwitch} />
                </Col>
                <Col md={5}>
                    <ArticleSelector
                        articleTitle={finishingArticle}
                        setArticleTitle={setFinishingArticle}
                        handleRandom={() => handleRandom(setFinishingArticle)}
                    />
                </Col>
            </Row>
            <Row className="mb-5">
                <Col md={12}>
                    <GoButton handleGo={handleGo} />
                </Col>
            </Row>
        </>
    );
}

function ArticleSelector({ articleTitle, setArticleTitle, handleRandom }) {
    const [suggestions, setSuggestions] = useState([]);

    const fetchSuggestions = async (value) => {
        if (value.length < 3) return [];
        const response = await fetch(
            `https://en.wikipedia.org/w/api.php?action=opensearch&format=json&origin=*&search=${value}`
        );
        const data = await response.json();
        return data[1];
    };

    const handleInputChange = async (event, value) => {
        setArticleTitle(value);
        const results = await fetchSuggestions(value);
        setSuggestions(results);
    };

    return (
        <div style={{ display: "flex", alignItems: "center" }}>
            <Autocomplete
                options={suggestions}
                freeSolo
                inputValue={articleTitle}
                onInputChange={handleInputChange}
                renderInput={(params) => <TextInput params={params} />}
                style={{ flexGrow: 1 }}
            />
            <Button onClick={handleRandom} style={{ marginLeft: "8px" }}>
                <IoShuffle size={30} />
            </Button>
        </div>
    );
}

function TextInput({ params }) {
    return (
        <TextField {...params} label="Enter article title" variant="outlined" />
    );
}

function SwitchButton({ handleSwitch }) {
    return (
        <Button onClick={handleSwitch}>
            <HiOutlineSwitchHorizontal size={30} />
        </Button>
    );
}

function GoButton({ handleGo }) {
    return (
        <Button onClick={handleGo}>
            <IoSearch size={25} /> Search
        </Button>
    );
}

export default ArticleInput;
