// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ArticleVoting {
    struct Article {
        uint256 upvote;
        uint256 downvote;
    }

    mapping(uint256 => Article) public articles;

    // Function to upvote an article
    function upvote(uint256 articleId) public {
        articles[articleId].upvote += 1;
    }

    // Function to downvote an article
    function downvote(uint256 articleId) public {
        articles[articleId].downvote += 1;
    }

    // Function to get the upvote and downvote count for an article
    function getVotes(uint256 articleId) public view returns (uint256 upvotes, uint256 downvotes) {
        return (articles[articleId].upvote, articles[articleId].downvote);
    }
}
