import React from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { MessageSquare, ThumbsUp } from 'lucide-react';
import { Card, CardHeader, CardDescription, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { User, Post as PostType } from '@/types';

interface Post extends PostType {
  board: 'Question' | 'Answer' | 'Normal';
}

interface PageInfo {
  first: boolean;
  last: boolean;
  totalPages: number;
}

const boardName: Record<Post['board'], string> = {
  Question: '질문',
  Answer: '답변',
  Normal: '자유게시판',
};

const boardUrl: Record<Post['board'], string> = {
  Question: '/question',
  Answer: '/question',
  Normal: '/freeboard',
};

export default function PostList() {
  const { userId } = useParams();
  const [searchParams] = useSearchParams();
  const [posts, setPosts] = React.useState<Array<Post | null>>([null, null, null, null, null]);
  const [user, setUser] = React.useState<User | null>(null);
  const [pageInfo, setPageInfo] = React.useState<PageInfo | null>(null);
  const [open, setOpen] = React.useState<boolean>(false);
  const page = parseInt(searchParams.get('page') || '1');

  React.useEffect(() => {
    const fetchData = async () => {
      const userData = await fetch(import.meta.env.VITE_API_URL + `/api/member?user=${userId}`, {
        method: 'GET',
      }).then((response) => response.json());

      setUser(userData.user);

      const postData = await fetch(import.meta.env.VITE_API_URL + `/api/member/posts?user=${userId}&page=${page - 1}`, {
        method: 'GET',
      }).then((response) => response.json());

      setPosts(postData.posts.content);
      setPageInfo({ first: postData.posts.first, last: postData.posts.last, totalPages: postData.posts.totalPages });
    };

    setOpen(false);
    fetchData();
  }, [userId, page]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  return (
    <Card className="w-full max-w-2xl lg:max-w-5xl xl:max-w-7xl">
      <CardHeader className="flex-row">
        <div className="flex flex-col space-y-1.5 w-full">
          {user ? <CardTitle>{`${user.nickname} (${user.id})`}</CardTitle> : <Skeleton className="h-6 w-[200px]" />}
          {user ? (
            <CardDescription>{`${user.nickname}님이 작성하신 게시글 목록입니다`}</CardDescription>
          ) : (
            <Skeleton className="h-3.5 w-[300px]" />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-28 text-center ellipsis">게시판</TableHead>
              <TableHead>제목</TableHead>
              <TableHead className="w-32 text-center ellipsis">작성자</TableHead>
              <TableHead className="w-32 text-center ellipsis">작성일</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post, index) =>
              post ? (
                <TableRow key={post.postNum}>
                  <TableCell className="text-center ellipsis">
                    <Badge variant="outline">{boardName[post.board]}</Badge>
                  </TableCell>
                  <TableCell className="ellipsis">
                    <Link to={`${boardUrl[post.board]}/${post.postNum}`} className="flex items-center w-full h-full">
                      <span className="mr-1">{post.title}</span>
                      {post.comment != 0 && (
                        <Badge variant="secondary" className="ml-1">
                          <MessageSquare className="w-3 h-3 mr-1" />
                          {post.comment}
                        </Badge>
                      )}
                      {post.like != 0 && (
                        <Badge variant="secondary" className="ml-1">
                          <ThumbsUp className="w-3 h-3 mr-1" />
                          {post.like}
                        </Badge>
                      )}
                    </Link>
                  </TableCell>
                  <TableCell className="text-center ellipsis">{post.user}</TableCell>
                  <TableCell className="text-center ellipsis">{formatDate(post.postingDate)}</TableCell>
                </TableRow>
              ) : (
                <TableRow key={index}>
                  <TableCell colSpan={4}>
                    <Skeleton className="flex justify-center items-center h-4"></Skeleton>
                  </TableCell>
                </TableRow>
              )
            )}
            {posts.length == 0 && (
              <TableRow>
                <TableCell colSpan={4}>
                  <div className="text-center text-muted-foreground">아직 작성한 게시글이 없습니다</div>
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
  );
}
