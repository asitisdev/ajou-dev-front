import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { cn, relativeTime } from '@/lib/utils';
import { CommentProps } from '@/types';
import CommentWrite from '@/components/CommentWrite';

export default function CommentList({ comments, onCommentsChange }: CommentProps) {
  const { user, isAuth } = useAuth();
  const [replyingTo, setReplyingTo] = React.useState<number | null>(null);

  React.useEffect(() => {
    setReplyingTo(null);
  }, [comments]);

  const handleReply = (commentNum: number) => {
    for (let i = comments.length - 1; i >= 0; i--) {
      if (comments[i].parent === commentNum) {
        setReplyingTo(comments[i].commentNum);
        return;
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">댓글</h3>
        <div className="space-y-2">
          {comments.map((comment) => (
            <>
              <div
                className={cn('border rounded-lg p-4', { 'ml-10': comment.commentNum !== comment.parent })}
                key={comment.commentNum}
              >
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
                      <div className="ml-auto flex gap-1">
                        {isAuth && comment.commentNum === comment.parent && (
                          <Button
                            onClick={() => handleReply(comment.commentNum)}
                            variant="ghost"
                            className="h-auto py-0 px-1 text-sm text-muted-foreground"
                          >
                            대댓글
                          </Button>
                        )}
                        {user.id === comment.id && (
                          <>
                            <Button variant="ghost" className="h-auto py-0 px-1 text-sm text-muted-foreground">
                              삭제
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                    <div>{comment.commentBody}</div>
                  </div>
                </div>
              </div>
              {comment.commentNum === replyingTo && (
                <CommentWrite comments={comments} onCommentsChange={onCommentsChange} parent={comment.parent} />
              )}
            </>
          ))}
        </div>
      </div>
      <CommentWrite comments={comments} onCommentsChange={onCommentsChange} parent={null} />
    </div>
  );
}
