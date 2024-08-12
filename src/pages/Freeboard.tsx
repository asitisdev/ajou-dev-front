import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';

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
  const { fetchAuth } = useAuth();
  const [post, setPost] = React.useState<Post>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAuth(`/api/normal/${postNum}`, 'GET');
      console.log(data.post);
      setPost(data.post);
    };

    fetchData();
  }, []);

  return (
    <Card className="w-full max-w-2xl lg:max-w-5xl xl:max-w-7xl">
      <CardHeader>
        <CardTitle>{post.title}</CardTitle>
        <CardDescription>{post.user}</CardDescription>
      </CardHeader>
      <CardContent>{post.textBody}</CardContent>
    </Card>
  );
}
