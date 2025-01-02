"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useSearchParams } from 'next/navigation';

const contractAddress = "0xf54b33BC3DAc69b5B862b018A9CEb32854b49Bf6";
const abi = [
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "articles",
    outputs: [
      { internalType: "uint256", name: "upvote", type: "uint256" },
      { internalType: "uint256", name: "downvote", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "articleId", type: "uint256" }],
    name: "downvote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "articleId", type: "uint256" }],
    name: "getVotes",
    outputs: [
      { internalType: "uint256", name: "upvotes", type: "uint256" },
      { internalType: "uint256", name: "downvotes", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "articleId", type: "uint256" }],
    name: "upvote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const Counter: React.FC = () => {
  const [articleId, setArticleId] = useState<number>(0);
  const [upvotes, setUpvotes] = useState<number>(0);
  const [downvotes, setDownvotes] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const searchParams = useSearchParams();

  const fetchVotes = async () => {
    if (typeof window === 'undefined' || !window.ethereum) return;

    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, abi, provider);

    try {
      const [up, down] = await contract.getVotes(articleId);
      setUpvotes(Number(up));
      setDownvotes(Number(down));
    } catch (err) {
      console.error("Error fetching votes:", err);
    }
  };

  const handleVote = async (type: "upvote" | "downvote") => {
    if (typeof window === 'undefined' || !window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);

    try {
      setLoading(true);
      const tx =
        type === "upvote"
          ? await contract.upvote(articleId)
          : await contract.downvote(articleId);
      await tx.wait();
      await fetchVotes(); // Refresh the vote counts
    } catch (err) {
      console.error(`Error processing ${type}:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const index = searchParams.get('index');
    if (index) {
      const incomingIndex = Number(index);
      setArticleId(incomingIndex);
    }
  }, [searchParams]);

  useEffect(() => {
    if (articleId > 0) fetchVotes();
  }, [articleId]);

  return (
    <div className="text-center">
      <h2>Article ID: {articleId}</h2>
      <input
        type="number"
        placeholder="Enter Article ID"
        value={articleId}
        onChange={(e) => setArticleId(Number(e.target.value))}
        className="mb-4 p-2 border rounded"
      />
      <h3>Upvotes: {upvotes}</h3>
      <h3>Downvotes: {downvotes}</h3>
      <Button
        variant="outline"
        onClick={() => handleVote("upvote")}
        disabled={loading}
      >
        {loading ? "Loading..." : "Upvote"}
      </Button>
      <Button
        variant="outline"
        onClick={() => handleVote("downvote")}
        disabled={loading}
        className="ml-2"
      >
        {loading ? "Loading..." : "Downvote"}
      </Button>
    </div>
  );
};

export default Counter;

