import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { EllipsisVertical, FilePen, Trash2, ThumbsUp } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import CommentList from '@/components/CommentList';
import { Post, Comment } from '@/types';

export default function Main() {
  const navigate = useNavigate();
  const { postNum } = useParams();
  const { isAuth, user, fetchAuth } = useAuth();
  const [open, setOpen] = React.useState(false);
  const [post, setPost] = React.useState<Post | null>(null);
  const [comments, setComments] = React.useState<Array<Comment>>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const data = isAuth
        ? await fetchAuth(`/api/normal?post=${postNum}`, 'GET')
        : await fetch(import.meta.env.VITE_API_URL + `/api/normal?post=${postNum}`, { method: 'GET' }).then(
            (response) => response.json()
          );

      if (data.status === 'success') {
        setPost(data.post);
        setComments(data.comments.content);
      } else if (data.status === 'error') {
        toast.error(data.message);
        navigate('/freeboard');
      }
    };

    fetchData();
  }, [isAuth]);

  const handleLike = async () => {
    const data = await fetchAuth(`/api/like?post=${postNum}`, 'GET');

    if (data.status === 'success') {
      if (post?.liked) toast.warning('좋아요를 취소했습니다');
      else toast.success('좋아요를 눌렀습니다');
      setPost(data.post);
    } else {
      console.log(data);
      toast.error(data.message);
    }
  };

  const handleDelete = async () => {
    const data = await fetchAuth(`/api/normal/delete?post=${postNum}`, 'POST');

    if (data.status === 'success') {
      toast.success('게시글을 삭제했습니다');
      navigate('/freeboard');
    } else {
      console.log(data);
      toast.error(data.message);
    }
  };

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
    <>
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
                  <Link to="./edit">
                    <FilePen className="mr-2 h-4 w-4" />
                    수정하기
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setOpen(true)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  삭제하기
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </CardHeader>
        <CardContent className="whitespace-pre-wrap">
          {post ? post.textBody : <Skeleton className="h-4 w-[300px]" />}
          {post && (
            <div className="flex justify-center my-4">
              <Button variant={post.liked ? 'default' : 'secondary'} onClick={handleLike} disabled={!isAuth}>
                <ThumbsUp className="w-4 h-4 mr-2" />
                {post.like}
              </Button>
            </div>
          )}
          <Separator className="my-6" />
          <CommentList comments={comments} onCommentsChange={setComments} />
        </CardContent>
      </Card>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>게시글 삭제</AlertDialogTitle>
            <AlertDialogDescription>정말 게시글을 삭제하시겠습니까?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>삭제</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
