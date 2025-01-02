import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { setArticleState } from "@/store/articleSlice";
import { useSession } from "next-auth/react";
import { useState } from "react";

export function NewsItem({
  title,
  image,
  description,
  link,
  articleId,
}: {
  title: string;
  image: string;
  description: string;
  link?: string;
  articleId?: string;
}) {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [receivedIndex, setReceivedIndex] = useState<number | null>(null);
  const isAdmin = session?.user?.role === "admin";

  const handleVoteClick = async () => {
    if (articleId && !isLoading) {
      setIsLoading(true);
      try {
        const response = await fetch('/api/article', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ articleId, title, summary: description }),
        });

        const data = await response.json();

        if (response.ok) {
          dispatch(setArticleState({ articleId, index: data.index }));
          setReceivedIndex(data.index);
          const link = document.createElement('a');
          link.href = `/counter?articleId=${articleId}&summary=${encodeURIComponent(description)}&title=${encodeURIComponent(title)}&index=${data.index}`;
          link.click();
        }
      } catch (error) {
        console.error('Error:', error);
        setIsLoading(false);
      }
    }
  };

  return (
    <Card className="overflow-hidden flex flex-col">
      <Image
        src={image}
        alt={title}
        width={300}
        height={200}
        className="w-full object-cover h-48"
      />
      <CardContent className="p-4 flex-grow">
        <h3 className="font-bold text-lg mb-2">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="link"
          onClick={() => link && window.open(link, "_blank")}
          className={!link ? "pointer-events-none opacity-50" : ""}
        >
          Read more
        </Button>
        {isAdmin && (
          <Button 
            variant="outline" 
            onClick={handleVoteClick}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Vote Now'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}