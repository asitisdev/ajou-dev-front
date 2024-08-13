import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface Post {
  postNum: number;
  title: string;
  textBody: string;
  user: string;
  like: number;
  visit: number;
  postingDate: string;
}

export default function Main() {
  const { postNum } = useParams();
  const [post, setPost] = React.useState<Post | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      const data = await fetch(import.meta.env.VITE_API_URL + `/api/normal?post=${postNum}`, { method: 'GET' }).then(
        (response) => response.json()
      );

      setPost(data.post);
    };

    fetchData();
  }, []);

  return (
    <Card className="w-full max-w-2xl lg:max-w-5xl xl:max-w-7xl">
      <CardHeader>
        <CardTitle>{post ? post.title : <Skeleton className="h-6 w-[400px]" />}</CardTitle>
        <CardDescription>{post ? post.user : <Skeleton className="h-3.5 w-[100px]" />}</CardDescription>
      </CardHeader>
      <CardContent>{post ? post.textBody : <Skeleton className="h-4 w-[300px]" />}</CardContent>
    </Card>
  );
}
