import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
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
import UserDropdown from '@/components/UserDropdown';
import { cn } from '@/lib/utils';
import { Post as PostType } from '@/types';

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

export default function SearchList() {
  const [searchParams] = useSearchParams();
  const [posts, setPosts] = React.useState<Array<Post | null>>([null, null, null, null, null, null, null, null]);
  const [pageInfo, setPageInfo] = React.useState<PageInfo | null>(null);
  const [open, setOpen] = React.useState<boolean>(false);
  const page = parseInt(searchParams.get('page') || '1');
  const keyword = searchParams.get('keyword') || '';

  React.useEffect(() => {
    const fetchData = async () => {
      const data = await fetch(import.meta.env.VITE_API_URL + `/api/search/posts?page=${page - 1}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keyword,
          title: 1,
          text: 1,
          user: 1,
        }),
      }).then((response) => response.json());

      setPosts(data.posts.content);
      setPageInfo({ first: data.posts.first, last: data.posts.last, totalPages: data.posts.totalPages });
    };

    setOpen(false);
    fetchData();
  }, [keyword, page]);

  const pageLink = (pageNum: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', pageNum.toString());
    return `?${newSearchParams.toString()}`;
  };

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
      <CardHeader>
        <CardTitle>검색 결과</CardTitle>
        <CardDescription>'{keyword}' 검색 결과입니다</CardDescription>
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
                    <Link to={`${boardUrl[post.board]}/${post.postNum}`} className="flex items-center w-full h-full">
                      <Badge variant="outline" className="mr-2">
                        {boardName[post.board]}
                      </Badge>
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
                  <TableCell className="text-center ellipsis">
                    <UserDropdown id={post.id} nickname={post.user} />
                  </TableCell>
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
                  <div className="text-center text-muted-foreground">검색 결과가 없습니다</div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {pageInfo && pageInfo.totalPages !== 0 && (
          <div className="mx-auto flex w-full justify-center gap-1 mt-4">
            <PaginationPrevious
              to={pageLink(page - 1)}
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
                        <PaginationLink to={pageLink(idx + 1)} isActive={page === idx + 1} className="w-8 h-8">
                          {idx + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                  </PaginationContent>
                </Pagination>
              </PopoverContent>
            </Popover>
            <PaginationNext
              to={pageLink(page + 1)}
              className={cn({ 'pointer-events-none opacity-50': pageInfo.last })}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
