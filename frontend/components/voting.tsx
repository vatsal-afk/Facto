"use client";

import { useState, useEffect } from "react";

import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import CryptoJS from "crypto-js";

import { useDispatch } from 'react-redux';
import { setArticleState } from '../store/articleSlice';

interface Article {
	id: number;
	title: string;
	contentHash: string;
	validVotes: number;
	invalidVotes: number;
	totalVotes: number;
}

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
	throw new Error("NEXT_PUBLIC_DEPLOYED_CONTRACT_ADDRESS is not set up!");
  }
  
  const contractAddress: string = process.env.NEXT_PUBLIC_DEPLOYED_CONTRACT_ADDRESS;
  
  const computeContentHash = (content: string) => {
	return CryptoJS.SHA256(content).toString();
  };
  
  interface VotingProps {
	articleId: number;
	title: string;
	description: string;
	account: string | null;
	connected: boolean | false;
  }
  
  export default function Voting({
	articleId,
    title,
    description,
    account,
    connected
}: VotingProps) {
    const [isVoting, setIsVoting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [article, setArticle] = useState<Article | null>(null);
    // const [articleCache, setArticleCache] = useState<{ [key: string]: Article }>({});

    const fetchArticle = async () => {

		const dispatch = useDispatch();

		// if (articleCache[articleId]) {
		// 	setArticle(articleCache[articleId]);
		// 	setIsLoading(false);
		// 	return;
		// }

        // // Reset states
        // setIsLoading(true);
        setError(null);

        try {
            // Validate MetaMask availability
            if (typeof window.ethereum === "undefined") {
                throw new Error("MetaMask is not installed.");
            }

            console.log(window.ethereum);

            // Create the BrowserProvider instance for Ethers v6
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(contractAddress, contractABI, signer);

            // Attempt to fetch article
            const articleData = await contract.getArticle(articleId);
            console.log(articleData);

            // If article not found, attempt to add it
            if (!articleData) {
                // Compute content hash
                const contentHash = computeContentHash(`${title}${description}`);
                console.log(title);
                console.log(contentHash);

				const count = (await contract.getArticleCount()).toNumber();
      			const articleId = count.toNumber() - 1;

				const articleState = {
					articleId: articleId
				}

				dispatch(setArticleState(articleState));

                // Add article to blockchain
                const tx = await contract.addArticle(title, contentHash);
                await tx.wait();

                // Fetch updated article data
                const newArticleData = await contract.getArticle(articleId);

                if (!newArticleData) {
                    throw new Error("Failed to retrieve article data after adding.");
                }

                const newArticle = {
                    id: articleId,
                    title: title,
                    description: description,
                    contentHash: newArticleData[1],
                    validVotes: newArticleData[2].toNumber(),
                    invalidVotes: newArticleData[3].toNumber(),
                    totalVotes: newArticleData[4].toNumber(),
                };

                // Update cache and state
                // setArticleCache(prev => ({
                //     ...prev,
                //     [articleId]: newArticle
                // }));
                setArticle(newArticle);
            } else {
                // Article exists, format and set
                const existingArticle = {
                    id: articleId,
                    title: articleData[0],
                    description: description, // Use passed description
                    contentHash: articleData[1],
                    validVotes: articleData[2].toNumber(),
                    invalidVotes: articleData[3].toNumber(),
                    totalVotes: articleData[4].toNumber(),
                };

                // Update cache and state
                // setArticleCache(prev => ({
                //     ...prev,
                //     [articleId]: existingArticle
                // }));
                setArticle(existingArticle);
            }
        } catch (error: any) {
            console.error("Error fetching or adding article:", error);
            setError(error.message || "An unexpected error occurred.");
            setArticle(null);
        } finally {
            setIsLoading(false);
        }
    };

    const vote = async (isValid: boolean) => {
        setIsVoting(true);
        setError(null);

        try {
            // Ensure MetaMask is available
            if (typeof window.ethereum === "undefined") {
                throw new Error("MetaMask is not installed.");
            }

            // Request account access
            await window.ethereum.request({ method: "eth_requestAccounts" });
            
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(contractAddress, contractABI, signer);

            // Submit vote
            const tx = await contract.vote(articleId, isValid);
            await tx.wait();

            // Refresh article data
            await fetchArticle();
        } catch (error: any) {
            console.error("Error voting on the article:", error);
            setError(error.message || "Failed to submit vote.");
        } finally {
            setIsVoting(false);
        }
    };

    useEffect(() => {
        if (connected && account && articleId && title && description) {
            fetchArticle();
        }
    }, [connected, account, articleId, title, description]);

    // if (isLoading) {
    //     return (
    //         <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
    //             <p>Loading article data...</p>
    //         </div>
    //     );
    // }

    if (error) {
        return (
            <div className="bg-red-100 dark:bg-red-900 p-4 rounded-lg">
                <p className="text-red-700 dark:text-red-200">{error}</p>
                <Button onClick={fetchArticle} className="mt-2">
                    Retry
                </Button>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <p>No article found.</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">
                Vote on Content Validity: {article.title}
            </h2>
            <div className="space-y-2 mb-4">
                <p><strong>Content Hash:</strong> {article.contentHash}</p>
                <p><strong>Valid Votes:</strong> {article.validVotes}</p>
                <p><strong>Invalid Votes:</strong> {article.invalidVotes}</p>
                <p><strong>Total Votes:</strong> {article.totalVotes}</p>
            </div>
            <div className="flex space-x-4">
                <Button 
                    onClick={() => vote(true)} 
                    disabled={isVoting}
                    variant="default"
                >
                    {isVoting ? "Submitting..." : "Valid"}
                </Button>
                <Button 
                    onClick={() => vote(false)} 
                    disabled={isVoting}
                    variant="destructive"
                >
                    {isVoting ? "Submitting..." : "Invalid"}
                </Button>
            </div>
        </div>
    );
}