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

export default function Voting({ articleId }: { articleId: string }) {
  const [isVoting, setIsVoting] = useState(false)
  const [article, setArticle] = useState<any>(null)

  const fetchArticle = async () => {
    try {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const contract = new ethers.Contract(contractAddress, contractABI, provider)

        const articleData = await contract.getArticle(articleId)
        setArticle({
          id: articleId,
          title: articleData[0],
          contentHash: articleData[1],
          validVotes: articleData[2].toNumber(),
          invalidVotes: articleData[3].toNumber(),
          totalVotes: articleData[4].toNumber(),
        })
      } else {
        console.log("Please install MetaMask!")
      }
    } catch (error) {
      console.error("Error fetching article:", error)
    }
  }

  useEffect(() => {
    fetchArticle()
  }, [articleId])

  const vote = async (choice: boolean) => {
    setIsVoting(true)
    try {
      if (typeof window.ethereum !== 'undefined') {
        await window.ethereum.request({ method: 'eth_requestAccounts' })
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, contractABI, signer)

        const transaction = await contract.vote(articleId, choice)
        await transaction.wait()
        console.log('Vote submitted successfully')
        fetchArticle()
      } else {
        console.log('Please install MetaMask!')
      }
    } catch (error) {
      console.error('Error voting:', error)
    }
    setIsVoting(false)
  }

  if (!article) {
    return <div>Loading article data...</div>
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Vote on Content Validity: {article.title}</h2>
      <p>Content Hash: {article.contentHash}</p>
      <p>Valid Votes: {article.validVotes}</p>
      <p>Invalid Votes: {article.invalidVotes}</p>
      <p>Total Votes: {article.totalVotes}</p>
      <div className="flex space-x-4 mt-4">
        <Button onClick={() => vote(true)} disabled={isVoting}>
          Valid
        </Button>
        <Button onClick={() => vote(false)} disabled={isVoting}>
          Invalid
        </Button>
      </div>
    </div>
  )
}
