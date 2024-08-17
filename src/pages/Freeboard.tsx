import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { EllipsisVertical } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import Comment from '@/components/Comment';

interface Post {
  postNum: number;
  title: string;
  textBody: string;
  user: string;
  id: string;
  like: number;
  visit: number;
  postingDate: string;
}

interface Comment {
  commentNum: number;
  commentBody: string;
  commentingDate: string;
  id: string;
  user: string;
}

export default function Main() {
  const { postNum } = useParams();
  const { user } = useAuth();
  const [post, setPost] = React.useState<Post | null>(null);
  const [comments, setComments] = React.useState<Array<Comment>>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const data = await fetch(import.meta.env.VITE_API_URL + `/api/normal?post=${postNum}`, { method: 'GET' }).then(
        (response) => response.json()
      );

      setPost(data.post);
      console.log(data.comments.content);
      setComments(data.comments.content);
    };

    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date
      .toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
      .replace(',', '');
  };

  return (
    <Card className="w-full max-w-2xl lg:max-w-5xl xl:max-w-7xl">
      <CardHeader className="flex-row">
        <div className="flex flex-col flex-grow space-y-1.5">
          {post ? <CardTitle>{post.title}</CardTitle> : <Skeleton className="h-6 w-[400px]" />}
          {post ? (
            <CardDescription>{`${post.user} \u00A0|\u00A0 ${formatDate(post.postingDate)}`}</CardDescription>
          ) : (
            <Skeleton className="h-3.5 w-[100px]" />
          )}
        </div>
        {post?.id === user.id && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                <EllipsisVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to="./edit">수정하기</Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">삭제하기</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>
      <CardContent className="whitespace-pre-wrap">
        {post ? post.textBody : <Skeleton className="h-4 w-[300px]" />}
        <Separator className="my-6" />
        <Comment comments={comments} onCommentsChange={setComments} />
      </CardContent>
    </Card>
  );
}
