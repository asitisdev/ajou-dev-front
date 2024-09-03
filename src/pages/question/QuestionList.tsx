import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { SquarePen, MessageSquareText, ThumbsUp } from 'lucide-react';
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
import { Question } from '@/types';

interface PageInfo {
  first: boolean;
  last: boolean;
  totalPages: number;
}

export default function QuestionList() {
  const [searchParams] = useSearchParams();
  const [questions, setQuestions] = React.useState<Array<Question | null>>([
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ]);
  const [pageInfo, setPageInfo] = React.useState<PageInfo | null>(null);
  const [open, setOpen] = React.useState<boolean>(false);
  const page = parseInt(searchParams.get('page') || '1');

  React.useEffect(() => {
    const fetchData = async () => {
      const data = await fetch(import.meta.env.VITE_API_URL + `/api/question/list?page=${page - 1}`, {
        method: 'GET',
      }).then((response) => response.json());

      setQuestions(data.questions.content);
      setPageInfo({ first: data.questions.first, last: data.questions.last, totalPages: data.questions.totalPages });
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
          <CardTitle>질문게시판</CardTitle>
          <CardDescription>아주대 개발자 커뮤니티 질문게시판입니다</CardDescription>
        </div>
        <Button asChild>
          <Link to="./write">
            <SquarePen className="mr-2 h-4 w-4" /> 질문하기
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
            {questions.map((question, index) =>
              question ? (
                <TableRow key={question.postNum}>
                  <TableCell className="text-center ellipsis">{question.visit}</TableCell>
                  <TableCell className="ellipsis">
                    <Link to={`./${question.postNum}`} className="flex items-center w-full h-full">
                      <span className="mr-1">{question.title}</span>
                      {question.answer != 0 && (
                        <Badge variant="secondary" className="ml-1">
                          <MessageSquareText className="w-3 h-3 mr-1" />
                          {question.answer}
                        </Badge>
                      )}
                      {question.like != 0 && (
                        <Badge variant="secondary" className="ml-1">
                          <ThumbsUp className="w-3 h-3 mr-1" />
                          {question.like}
                        </Badge>
                      )}
                    </Link>
                  </TableCell>
                  <TableCell className="text-center ellipsis">
                    {question.id === null || question.user === null ? (
                      <span>익명</span>
                    ) : (
                      <UserDropdown id={question.id} nickname={question.user} />
                    )}
                  </TableCell>
                  <TableCell className="text-center ellipsis">{formatDate(question.postingDate)}</TableCell>
                </TableRow>
              ) : (
                <TableRow key={index}>
                  <TableCell colSpan={4}>
                    <Skeleton className="flex justify-center items-center h-4"></Skeleton>
                  </TableCell>
                </TableRow>
              )
            )}
            {questions.length == 0 && (
              <TableRow>
                <TableCell colSpan={4}>
                  <div className="text-center text-muted-foreground">아직 게시글이 없습니다</div>
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
