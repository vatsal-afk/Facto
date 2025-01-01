// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract NewsVoting {
    struct Article {
        string title;
        string contentHash; // A hash of the article content for verification
        uint256 validVotes;
        uint256 invalidVotes;
        address[] voters;
        mapping(address => bool) hasVoted;
    }

    Article[] public articles;
    address public admin;

    event ArticleAdded(uint256 articleId, string title, string contentHash);
    event Voted(uint256 articleId, address vot er, bool vote);

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    function addArticle(string memory title, string memory contentHash) public onlyAdmin {
        Article storage newArticle = articles.push();
        newArticle.title = title;
        newArticle.contentHash = contentHash;

        emit ArticleAdded(articles.length - 1, title, contentHash);
    }

    function vote(uint256 articleId, bool voteValid) public {
        require(articleId < articles.length, "Invalid article ID");
        Article storage article = articles[articleId];
        require(!article.hasVoted[msg.sender], "You have already voted on this article");

        article.hasVoted[msg.sender] = true;
        article.voters.push(msg.sender);

        if (voteValid) {
            article.validVotes++;
        } else {
            article.invalidVotes++;
        }

        emit Voted(articleId, msg.sender, voteValid);
    }

    function getArticle(uint256 articleId)
        public
        view
        returns (
            string memory title,
            string memory contentHash,
            uint256 validVotes,
            uint256 invalidVotes,
            uint256 totalVotes
        )
    {
        require(articleId < articles.length, "Invalid article ID");
        Article storage article = articles[articleId];
        return (
            article.title,
            article.contentHash,
            article.validVotes,
            article.invalidVotes,
            article.voters.length
        );
    }

    function getArticleCount() public view returns (uint256) {
        return articles.length;
    }
}
