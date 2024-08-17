import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { relativeTime } from '@/lib/utils';

interface Comment {
  commentNum: number;
  commentBody: string;
  commentingDate: string;
  id: string;
  user: string;
}

interface CommentProps {
  comments: Array<Comment>;
  onCommentsChange: React.Dispatch<React.SetStateAction<Array<Comment>>>;
}

export default function Comment({ comments, onCommentsChange }: CommentProps) {
  const { user, isAuth, fetchAuth } = useAuth();
  const { postNum } = useParams();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const comment = new FormData(form).get('comment');

    if (comment) {
      const data = await fetchAuth(`/api/comment/create?post=${postNum}`, 'POST', { commentBody: comment });
      onCommentsChange(data.comments.content);
      form.reset();
      toast.success('댓글을 작성했습니다');
    } else {
      toast.error('댓글 내용을 입력해주세요');
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">댓글</h3>
        <div className="space-y-4">
          {comments.map((comment) => (
            <div className="border rounded-lg p-4" key={comment.commentNum}>
              <div className="flex items-start gap-4">
                <Avatar className="w-10 h-10 border">
                  <AvatarFallback>{comment.user.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="w-full grid gap-1.5">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold">{comment.user}</div>
                    <div className="text-gray-500 text-xs dark:text-gray-400">
                      {relativeTime(comment.commentingDate)}
                    </div>
                    <div className="ml-auto flex gap-2">
                      <Link to="#" className="text-sm text-muted-foreground">
                        대댓글
                      </Link>
                      {user.id === comment.id && (
                        <>
                          <Link to="#" className="text-sm text-muted-foreground">
                            삭제
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                  <div>{comment.commentBody}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <form onSubmit={onSubmit} className="w-full flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
          <Input
            name="comment"
            placeholder={isAuth ? '댓글을 입력하세요' : '댓글을 작성하시려면 로그인하세요'}
            disabled={!isAuth}
          />
          <Button type="submit" className="flex items-center" disabled={!isAuth}>
            <Pencil className="mr-2 w-4 h-4" />
            <span>댓글 작성하기</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
