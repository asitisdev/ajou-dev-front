import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, ThumbsUp } from 'lucide-react';
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
  const [posts, setPosts] = React.useState<Post[]>([]);

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
    <Card className="w-full max-w-2xl lg:max-w-4xl xl:max-w-7xl">
      <CardHeader>
        <CardTitle>자유게시판</CardTitle>
        <CardDescription>아주대 개발자 커뮤니티 자유게시판입니다</CardDescription>
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
            {posts.map((post) => (
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
            ))}
          </TableBody>
        </Table>
        <Pagination>
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
