import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { EllipsisVertical, FilePen, Trash2, ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
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
import AnswerWrite from '@/components/AnswerWrite';
import { relativeTime } from '@/lib/utils';
import { Question as QuestionType, Answer } from '@/types';

export default function Question() {
  const navigate = useNavigate();
  const { postNum } = useParams();
  const { isAuth, user, fetchAuth } = useAuth();
  const [deleting, setDeleting] = React.useState<number | undefined>(undefined);
  const [question, setQuestion] = React.useState<QuestionType | null>(null);
  const [answers, setAnswers] = React.useState<Array<Answer>>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const data = isAuth
        ? await fetchAuth(`/api/question?post=${postNum}`, 'GET')
        : await fetch(import.meta.env.VITE_API_URL + `/api/question?post=${postNum}`, { method: 'GET' }).then(
            (response) => response.json()
          );

      if (data.status === 'success') {
        setQuestion(data.post);
        setAnswers(data.answers.content);
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
      if (question?.liked) toast.warning('좋아요를 취소했습니다');
      else toast.success('좋아요를 눌렀습니다');
      setQuestion(data.post);
    } else {
      console.log(data);
      toast.error(data.message);
    }
  };

  const handleUpvote = async (postNum: number) => {
    const data = await fetchAuth(`/api/like/answer?post=${postNum}`, 'GET');

    if (data.status === 'success') {
      toast.success('답변을 추천합니다');
      setAnswers((prev) => prev.map((answer) => (answer.postNum === data.answer.postNum ? data.answer : answer)));
    } else {
      console.log(data);
      toast.error(data.message);
    }
  };

  const handleDownvote = async (postNum: number) => {
    const data = await fetchAuth(`/api/dislike/answer?post=${postNum}`, 'GET');

    if (data.status === 'success') {
      toast.warning('답변을 비추천합니다');
      setAnswers((prev) => prev.map((answer) => (answer.postNum === data.answer.postNum ? data.answer : answer)));
    } else {
      console.log(data);
      toast.error(data.message);
    }
  };

  const handleDelete = async () => {
    const data = await fetchAuth(
      `/api/${deleting === question?.postNum ? 'question' : 'answer'}/delete?post=${deleting}`,
      'POST'
    );

    if (data.status === 'success') {
      toast.success(deleting === question?.postNum ? '질문을 삭제했습니다' : '답변을 삭제했습니다');
      navigate('/question');
    } else {
      console.log(data);
      toast.error(data.message);
    }
  };

  return (
    <>
      <Card className="w-full max-w-2xl lg:max-w-5xl xl:max-w-7xl mb-4">
        <CardHeader className="flex-row">
          <div className="flex flex-col flex-grow space-y-1.5">
            {question ? <CardTitle>{question.title}</CardTitle> : <Skeleton className="h-6 w-[400px]" />}
            {question ? (
              <CardDescription className="flex flex-row gap-2">
                <span>{question.user}</span>
                <span>|</span>
                <span>{`${relativeTime(question.postingDate)} 작성`}</span>
                <span>|</span>
                <span>{`${question.visit}회 조회`}</span>
              </CardDescription>
            ) : (
              <Skeleton className="h-3.5 w-[100px]" />
            )}
          </div>
          {question?.id === user?.id && (
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
                <DropdownMenuItem onClick={() => setDeleting(question?.postNum)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  삭제하기
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </CardHeader>
        <CardContent className="whitespace-pre-wrap">
          {question ? <p>{question.textBody}</p> : <Skeleton className="h-4 w-[300px]" />}
          {question && (
            <div className="flex justify-center my-4">
              <Button variant={question.liked ? 'default' : 'secondary'} onClick={handleLike} disabled={!isAuth}>
                <ThumbsUp className="w-4 h-4 mr-2" />
                {question.like}
              </Button>
            </div>
          )}

          {question && (
            <>
              <Separator className="my-6" />
              <div className="flex flex-row items-center">
                <MessageSquare className="w-4 h-4 mr-2" />
                <p>{`댓글 ${question.comment}`}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {answers.map((answer, index) => (
        <Card className="w-full max-w-2xl lg:max-w-5xl xl:max-w-7xl" key={answer.postNum}>
          {index === 0 && (
            <>
              <div className="flex flex-col space-y-1.5 px-6 py-4">
                <h2 className="scroll-m-20 text-xl font-semibold tracking-tight">{`${answers.length}개의 답변`}</h2>
              </div>
              <Separator />
            </>
          )}
          <CardHeader className="flex-row">
            <div className="flex flex-col flex-grow space-y-1.5">
              {answer ? <CardTitle>{answer.title}</CardTitle> : <Skeleton className="h-6 w-[400px]" />}
              {answer ? (
                <CardDescription className="flex flex-row gap-2">
                  <span>{answer.user}</span>
                  <span>|</span>
                  <span>{`${relativeTime(answer.postingDate)} 작성`}</span>
                </CardDescription>
              ) : (
                <Skeleton className="h-3.5 w-[100px]" />
              )}
            </div>
            {answer?.id === user?.id && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost">
                    <EllipsisVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/edit">
                      <FilePen className="mr-2 h-4 w-4" />
                      수정하기
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setDeleting(answer?.postNum)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    삭제하기
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </CardHeader>
          <CardContent className="whitespace-pre-wrap">
            {answer ? (
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center gap-2 text-gray-500">
                  <ThumbsUp
                    className={`h-5 w-5 cursor-pointer transition-transform ${
                      answer.isLiked ? 'text-primary transform scale-110' : 'text-gray-500'
                    }`}
                    onClick={() => handleUpvote(answer.postNum)}
                  />
                  <span>{answer.like - answer.dislike}</span>
                  <ThumbsDown
                    className={`h-5 w-5 cursor-pointer transition-transform ${
                      answer.isDisliked ? 'text-primary transform scale-110' : 'text-gray-500'
                    }`}
                    onClick={() => handleDownvote(answer.postNum)}
                  />
                </div>
                <div className="flex-1">
                  <p className="text-gray-700 mt-2">{answer.textBody}</p>
                </div>
              </div>
            ) : (
              <Skeleton className="h-4 w-[300px]" />
            )}
            {answer && (
              <>
                <Separator className="my-6" />
                <div className="flex flex-row items-center">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  <p>{`댓글 ${answer.comment}`}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ))}

      {isAuth && <AnswerWrite onAnswersChange={setAnswers} />}

      <AlertDialog
        open={deleting !== undefined}
        onOpenChange={(open) => (open ? setDeleting(0) : setDeleting(undefined))}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>게시글 삭제</AlertDialogTitle>
            <AlertDialogDescription>정말 해당 게시글을 삭제하시겠습니까?</AlertDialogDescription>
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
