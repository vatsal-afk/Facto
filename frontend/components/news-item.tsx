import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { setArticleState } from "@/store/articleSlice";
import { useSession } from "next-auth/react";

interface NewsItemProps {
  title: string;
  image: string;
  description: string;
  link?: string;
  articleId?: string;
  index?: number;
}

export function NewsItem({
  title,
  image,
  description,
  link,
  articleId,
  index,
}: NewsItemProps) {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  
  // Check if user is admin
  const isAdmin = session?.user?.role === "admin";

  const handleVoteClick = () => {
    if (articleId) {
      dispatch(setArticleState({ articleId }));
      // console.log("Article ID set in Redux: ",${articleId});
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
          <Link
            href={{
              pathname: "/voting",
              query: { articleId, title, description },
            }}
            passHref
          >
            <Button variant="outline" onClick={handleVoteClick}>
              Vote Now
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}