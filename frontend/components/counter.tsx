"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowBigUp, ArrowBigDown } from 'lucide-react';

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

const VotingComponent: React.FC = () => {
  const [articleId, setArticleId] = useState<number>(0);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [upvotes, setUpvotes] = useState<number>(0);
  const [downvotes, setDownvotes] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  const fetchVotes = async () => {
    if (typeof window === 'undefined' || !window.ethereum) return;

    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, abi, provider);

    try {
      const [up, down] = await contract.getVotes(articleId);
      setUpvotes(Number(up));
      setDownvotes(Number(down));
      setError(null);
    } catch (err) {
      console.error("Error fetching votes:", err);
      setError("Failed to fetch votes. Please try again.");
    }
  };

  const handleVote = async (type: "upvote" | "downvote") => {
    if (typeof window === 'undefined' || !window.ethereum) {
      setError("Please install MetaMask!");
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    try {
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      setLoading(true);
      setError(null);
      const tx = type === "upvote" ? await contract.upvote(articleId) : await contract.downvote(articleId);
      await tx.wait();
      await fetchVotes();
    } catch (err) {
      console.error(`Error processing ${type}:`, err);
      setError(`Failed to ${type}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const index = searchParams.get('index');
    const titleParam = searchParams.get('title');
    const descriptionParam = searchParams.get('description');

    if (index) {
      setArticleId(Number(index));
    }
    if (titleParam) {
      setTitle(titleParam);
    }
    if (descriptionParam) {
      setDescription(descriptionParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (articleId > 0) fetchVotes();
  }, [articleId]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">{`Article ${articleId}`}</CardTitle>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="flex justify-center items-center space-x-8 mb-6">
          <div className="text-center">
            <p className="text-2xl font-bold">{upvotes}</p>
            <p className="text-sm text-muted-foreground">Upvotes</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{downvotes}</p>
            <p className="text-sm text-muted-foreground">Downvotes</p>
          </div>
        </div>
        <div className="flex justify-center space-x-4">
          <Button
            variant="outline"
            onClick={() => handleVote("upvote")}
            disabled={loading}
            className="w-32"
          >
            {loading ? "Loading..." : (
              <>
                <ArrowBigUp className="mr-2 h-4 w-4" />
                Upvote
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => handleVote("downvote")}
            disabled={loading}
            className="w-32"
          >
            {loading ? "Loading..." : (
              <>
                <ArrowBigDown className="mr-2 h-4 w-4" />
                Downvote
              </>
            )}
          </Button>
        </div>
        {error && (
          <p className="text-red-500 text-center mt-4">{error}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default VotingComponent;

