import React from 'react';
import { Link } from 'react-router-dom';
import { SquarePen, MessageSquare, ThumbsUp } from 'lucide-react';
import { Card, CardHeader, CardDescription, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';

interface Post {
  postNum: number;
  title: string;
  user: string;
  postingDate: string;
}

export default function Freeboard() {
  const { fetchAuth } = useAuth();
  const [posts, setPosts] = React.useState<Array<Post | null>>([null, null, null, null, null, null, null, null]);

  React.useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAuth('/api/normal/list?page=0', 'GET');
      console.log(data.posts.content);
      setPosts(data.posts.content);
    };

    fetchData();
  }, []);

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
              <TableHead className="w-20 text-center">조회수</TableHead>
              <TableHead>제목</TableHead>
              <TableHead className="w-32 text-center">작성자</TableHead>
              <TableHead className="w-32 text-center">작성일</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) =>
              post ? (
                <TableRow>
                  <TableCell className="text-center">{Math.floor(Math.random() * 100)}</TableCell>
                  <Link to={`./${post.postNum}`}>
                    <TableCell className="flex items-center">
                      <span className="mr-1">{post.title}</span>
                      <Badge variant="secondary" className="ml-1">
                        <MessageSquare className="w-3 h-3 mr-1" />
                        {Math.floor(Math.random() * 100)}
                      </Badge>
                      <Badge variant="secondary" className="ml-1">
                        <ThumbsUp className="w-3 h-3 mr-1" />
                        {Math.floor(Math.random() * 100)}
                      </Badge>
                    </TableCell>
                  </Link>
                  <TableCell className="w-32 max-w-32 text-center overflow-hidden whitespace-nowrap text-ellipsis">
                    {post.user}
                  </TableCell>
                  <TableCell className="w-32 text-center">{formatDate(post.postingDate)}</TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell colSpan={4}>
                    <Skeleton className="flex justify-center items-center h-4"></Skeleton>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious to="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink to="#" isActive>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink to="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink to="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext to="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardContent>
    </Card>
  );
}
