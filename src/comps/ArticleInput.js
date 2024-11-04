import React, { useState } from "react";
import { InputGroup, Input, Button, Row, Col } from "reactstrap";
import { IoShuffle, IoSearch } from "react-icons/io5";
import { HiOutlineSwitchHorizontal } from "react-icons/hi";

function ArticleInput({ setArticles, setResults }) {
    const [startingArticle, setStartingArticle] = useState("");
    const [finishingArticle, setFinishingArticle] = useState("");

    const handleInputChange = (event, setter) => {
        setter(event.target.value);
    };

    const handleRandom = async (setter) => {
        const randomUrl = "https://en.wikipedia.org/w/api.php?action=query&list=random&rnlimit=1&rnnamespace=0&format=json&origin=*";
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
            finish: finishingArticle
        })
        setResults([])
    }

    return (
        <>
            <Row className="mb-5">
                <Col md={5}>
                    <ArticleSelector
                        articleTitle={startingArticle}
                        handleInputChange={(event) => handleInputChange(event, setStartingArticle)}
                        handleRandom={() => handleRandom(setStartingArticle)}
                    />
                </Col>
                <Col md={2}>
                    <SwitchButton handleSwitch={handleSwitch} />
                </Col>
                <Col md={5}>
                    <ArticleSelector
                        articleTitle={finishingArticle}
                        handleInputChange={(event) => handleInputChange(event, setFinishingArticle)}
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

function ArticleSelector({ articleTitle, handleInputChange, handleRandom }) {
    return (
        <InputGroup>
            <Input
                placeholder="Enter article title..."
                value={articleTitle}
                onChange={handleInputChange}
            />
            <Button onClick={handleRandom}>
                <IoShuffle size={30} />
            </Button>
        </InputGroup>
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
