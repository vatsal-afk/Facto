import Image from 'next/image'
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface NewsItemProps {
  title: string
  image: string
  description: string
  link?: string
  voteLink?: string;
}

export function NewsItem({ title, image, description, link, voteLink }: NewsItemProps) {

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
      <CardFooter>
        <Button 
          variant="link" 
          onClick={() => link && window.open(link, '_blank')}
          className={!link ? 'pointer-events-none opacity-50' : ''}
        >
          Read more
        </Button>
        <Button variant="outline">
          <Link href={voteLink || "#"} passHref>
            Vote Now
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}