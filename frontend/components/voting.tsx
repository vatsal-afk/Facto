"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";

const contractABI = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "title",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "contentHash",
				"type": "string"
			}
		],
		"name": "addArticle",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "articleId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "title",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "contentHash",
				"type": "string"
			}
		],
		"name": "ArticleAdded",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "articleId",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "voteValid",
				"type": "bool"
			}
		],
		"name": "vote",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "articleId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "voter",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "vote",
				"type": "bool"
			}
		],
		"name": "Voted",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "admin",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "articles",
		"outputs": [
			{
				"internalType": "string",
				"name": "title",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "contentHash",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "validVotes",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "invalidVotes",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "articleId",
				"type": "uint256"
			}
		],
		"name": "getArticle",
		"outputs": [
			{
				"internalType": "string",
				"name": "title",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "contentHash",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "validVotes",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "invalidVotes",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalVotes",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getArticleCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

if (!process.env.NEXT_PUBLIC_DEPLOYED_CONTRACT_ADDRESS) {
  throw new Error("NEXT_PUBLIC_DEPLOYED_CONTRACT_ADDRESS is not set in the environment variables.");
}

const contractAddress: string = process.env.NEXT_PUBLIC_DEPLOYED_CONTRACT_ADDRESS;

export default function Voting() {
  const [articles, setArticles] = useState<any[]>([]);
  const [isVoting, setIsVoting] = useState(false);

  const fetchArticles = async () => {
    try {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, contractABI, provider);

        const articleCount = await contract.getArticleCount();
        const articlesArray = [];
        for (let i = 0; i < articleCount; i++) {
          const article = await contract.getArticle(i);
          articlesArray.push({
            id: i,
            title: article[0],
            contentHash: article[1],
            validVotes: article[2].toNumber(),
            invalidVotes: article[3].toNumber(),
            totalVotes: article[4].toNumber(),
          });
        }
        setArticles(articlesArray);
      } else {
        console.log("Please install MetaMask!");
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  const vote = async (articleId: number, voteValid: boolean) => {
    setIsVoting(true);
    try {
      if (typeof window.ethereum !== "undefined") {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        const transaction = await contract.vote(articleId, voteValid);
        await transaction.wait();
        console.log("Vote submitted successfully");
        fetchArticles(); // Refresh articles
      } else {
        console.log("Please install MetaMask!");
      }
    } catch (error) {
      console.error("Error voting:", error);
    }
    setIsVoting(false);
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Vote on News Articles</h2>
      {articles.map((article) => (
        <div key={article.id} className="mb-6">
          <h3 className="text-lg font-medium">{article.title}</h3>
          <p className="text-sm text-gray-600">
            Valid Votes: {article.validVotes} | Invalid Votes: {article.invalidVotes}
          </p>
          <div className="flex space-x-4 mt-2">
            <Button
              onClick={() => vote(article.id, true)}
              disabled={isVoting}
            >
              Valid
            </Button>
            <Button
              onClick={() => vote(article.id, false)}
              disabled={isVoting}
            >
              Invalid
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
