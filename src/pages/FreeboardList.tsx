import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { SquarePen, MessageSquare, ThumbsUp } from 'lucide-react';
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
import { Post } from '@/types';

interface PageInfo {
  first: boolean;
  last: boolean;
  totalPages: number;
}

export default function Freeboard() {
  const [searchParams] = useSearchParams();
  const [posts, setPosts] = React.useState<Array<Post | null>>([null, null, null, null, null, null, null, null]);
  const [pageInfo, setPageInfo] = React.useState<PageInfo | null>(null);
  const [open, setOpen] = React.useState<boolean>(false);
  const page = parseInt(searchParams.get('page') || '1');

  React.useEffect(() => {
    const fetchData = async () => {
      const data = await fetch(import.meta.env.VITE_API_URL + `/api/normal/list?page=${page - 1}`, {
        method: 'GET',
      }).then((response) => response.json());

      setPosts(data.posts.content);
      setPageInfo({ first: data.posts.first, last: data.posts.last, totalPages: data.posts.totalPages });
    };

    setOpen(false);
    fetchData();
  }, [page]);

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
          <CardTitle>자유게시판</CardTitle>
          <CardDescription>아주대 개발자 커뮤니티 자유게시판입니다</CardDescription>
        </div>
        <Button asChild>
          <Link to="./write">
            <SquarePen className="mr-2 h-4 w-4" /> 글쓰기
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20 text-center ellipsis">조회수</TableHead>
              <TableHead>제목</TableHead>
              <TableHead className="w-32 text-center ellipsis">작성자</TableHead>
              <TableHead className="w-32 text-center ellipsis">작성일</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post, index) =>
              post ? (
                <TableRow key={post.postNum}>
                  <TableCell className="text-center ellipsis">{post.visit}</TableCell>
                  <TableCell className="ellipsis">
                    <Link to={`./${post.postNum}`} className="flex items-center w-full h-full">
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
          </TableBody>
        </Table>
        {pageInfo && (
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
