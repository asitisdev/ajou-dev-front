import React from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Card, CardHeader, CardDescription, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { cn, relativeTime } from '@/lib/utils';
import { User, Comment } from '@/types';

interface PageInfo {
  first: boolean;
  last: boolean;
  totalPages: number;
}

export default function CommentList() {
  const { userId } = useParams();
  const { fetchAuth, user: myInfo } = useAuth();
  const [searchParams] = useSearchParams();
  const [user, setUser] = React.useState<User | null>(null);
  const [comments, setComments] = React.useState<Array<(Comment & { postNum: string; postTitle: string }) | null>>([
    null,
    null,
    null,
    null,
    null,
  ]);
  const [pageInfo, setPageInfo] = React.useState<PageInfo | null>(null);
  const [open, setOpen] = React.useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = React.useState<boolean>(false);
  const [deleting, setDeleting] = React.useState<number | null>(null);
  const page = parseInt(searchParams.get('page') || '1');

  React.useEffect(() => {
    const fetchData = async () => {
      const userData = await fetch(import.meta.env.VITE_API_URL + `/api/member?user=${userId}`, {
        method: 'GET',
      }).then((response) => response.json());

      setUser(userData.user);

      const commentData = await fetch(
        import.meta.env.VITE_API_URL + `/api/member/comments?user=${userId}&page=${page - 1}`,
        {
          method: 'GET',
        }
      ).then((response) => response.json());

      setComments(commentData.comments.content);
      setPageInfo({
        first: commentData.comments.first,
        last: commentData.comments.last,
        totalPages: commentData.comments.totalPages,
      });
    };

    setOpen(false);
    fetchData();
  }, [userId, page]);

  const handleDelete = async () => {
    const data = await fetchAuth(`/api/comment/delete`, 'POST', {
      commentNum: deleting,
    });

    if (data.status === 'success') {
      toast.success('댓글을 삭제했습니다');

      const commentData = await fetch(
        import.meta.env.VITE_API_URL + `/api/member/comments?user=${userId}&page=${page - 1}`,
        {
          method: 'GET',
        }
      ).then((response) => response.json());

      setComments(commentData.comments.content);
      setPageInfo({
        first: commentData.comments.first,
        last: commentData.comments.last,
        totalPages: commentData.comments.totalPages,
      });
    } else {
      console.log(data);
      toast.error(data.message);
    }
  };

  return (
    <>
      <Card className="w-full max-w-2xl lg:max-w-5xl xl:max-w-7xl">
        <CardHeader className="flex-row">
          <div className="flex flex-col space-y-1.5 w-full">
            {user ? <CardTitle>{`${user.nickname} (${user.id})`}</CardTitle> : <Skeleton className="h-6 w-[200px]" />}
            {user ? (
              <CardDescription>{`${user.nickname}님이 작성하신 댓글 목록입니다`}</CardDescription>
            ) : (
              <Skeleton className="h-3.5 w-[300px]" />
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              {comments.map((comment, index) =>
                comment ? (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex gap-4 mb-3">
                        <div className="w-full border rounded-lg p-4" key={comment.commentNum}>
                          {comment.id === null ? (
                            '삭제된 댓글입니다'
                          ) : (
                            <div className="flex items-start gap-4">
                              <div className="w-full grid gap-1.5">
                                <div className="flex items-center gap-2">
                                  <div className="font-semibold">{comment.user}</div>
                                  <div className="text-gray-500 text-xs dark:text-gray-400">
                                    {relativeTime(comment.commentingDate)}
                                  </div>
                                  <div className="ml-auto flex gap-1">
                                    {user && user.id === myInfo?.id && (
                                      <Button
                                        onClick={() => {
                                          setDialogOpen(true);
                                          setDeleting(comment.commentNum);
                                        }}
                                        variant="ghost"
                                        className="h-auto py-0 px-1 text-sm text-muted-foreground"
                                      >
                                        삭제
                                      </Button>
                                    )}
                                  </div>
                                </div>
                                <div>{comment.commentBody}</div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <Link
                          to={`/freeboard/${comment.postNum}`}
                          className="px-1 py-1 font-medium text-primary underline underline-offset-4"
                        >
                          {comment.postTitle}
                        </Link>
                        에 남긴 댓글
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow key={index}>
                    <TableCell colSpan={4}>
                      <Skeleton className="flex justify-center items-center h-4"></Skeleton>
                    </TableCell>
                  </TableRow>
                )
              )}
              {comments.length == 0 && (
                <TableRow>
                  <TableCell colSpan={4}>
                    <div className="text-center text-muted-foreground">아직 작성한 댓글이 없습니다 </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {pageInfo && pageInfo.totalPages !== 0 && (
            <div className="mx-auto flex w-full justify-center gap-1 mt-4">
              <PaginationPrevious
                to={`?page=${page - 1}`}
                className={cn({ 'pointer-events-none opacity-50': pageInfo.first })}
              />
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline">{`${page} / ${pageInfo.totalPages} 페이지`}</Button>
                </PopoverTrigger>
                <PopoverContent className="p-1">
                  <Pagination>
                    <PaginationContent className="grid gap-1 grid-cols-5 lg:grid-cols-10">
                      {Array.from({ length: pageInfo.totalPages }).map((_, idx) => (
                        <PaginationItem key={idx}>
                          <PaginationLink to={`?page=${idx + 1}`} isActive={page === idx + 1} className="w-8 h-8">
                            {idx + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                    </PaginationContent>
                  </Pagination>
                </PopoverContent>
              </Popover>
              <PaginationNext
                to={`?page=${page + 1}`}
                className={cn({ 'pointer-events-none opacity-50': pageInfo.last })}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>댓글 삭제</AlertDialogTitle>
            <AlertDialogDescription>해당 댓글을 정말 삭제하시겠습니까?</AlertDialogDescription>
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
