import React from 'react';
import { CornerDownRight } from 'lucide-react';
import { toast } from 'sonner';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
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
import UserDropdown from '@/components/UserDropdown';
import { useAuth } from '@/hooks/useAuth';
import { relativeTime } from '@/lib/utils';
import { CommentProps } from '@/types';
import CommentWrite from '@/components/CommentWrite';

export default function CommentList({ comments, onCommentsChange }: CommentProps) {
  const { user, isAuth, fetchAuth } = useAuth();
  const [replyingTo, setReplyingTo] = React.useState<number | null>(null);
  const [deleting, setDeleting] = React.useState<number | null>(null);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setReplyingTo(null);
  }, [comments]);

  const handleReply = (commentNum: number) => {
    for (let i = comments.length - 1; i >= 0; i--) {
      if (comments[i].parent === commentNum) {
        setReplyingTo((prev) => (prev === comments[i].commentNum ? null : comments[i].commentNum));
        return;
      }
    }
  };

  const handleDelete = async () => {
    const data = await fetchAuth(`/api/comment/delete`, 'POST', {
      commentNum: deleting,
    });

    if (data.status === 'success') {
      toast.success('댓글을 삭제했습니다');
      onCommentsChange(data.comments.content);
    } else {
      console.log(data);
      toast.error(data.message);
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div className="space-y-4">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">댓글</h3>
          <div className="space-y-2">
            {comments.map((comment) => (
              <React.Fragment key={comment.commentNum}>
                <div className="flex gap-2">
                  {comment.commentNum !== comment.parent && <CornerDownRight className="w-4 h-4 mt-2 block" />}
                  <div className="w-full border rounded-lg p-4" key={comment.commentNum}>
                    {comment.id === null ? (
                      '삭제된 댓글입니다'
                    ) : (
                      <div className="flex items-start gap-4">
                        <Avatar className="w-10 h-10 border">
                          <AvatarImage
                            src={import.meta.env.VITE_API_URL + `/api/file/profile/download?user=${comment.id}`}
                            alt={comment.user}
                          />
                          <AvatarFallback>{comment.user.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="w-full grid gap-1.5">
                          <div className="flex items-center gap-2">
                            <UserDropdown id={comment.id} nickname={comment.user} className="font-semibold" />
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
                              {user?.id === comment.id && (
                                <Button
                                  onClick={() => {
                                    setOpen(true);
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
                {comment.commentNum === replyingTo && (
                  <CommentWrite comments={comments} onCommentsChange={onCommentsChange} parent={comment.parent} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        {replyingTo === null && <CommentWrite comments={comments} onCommentsChange={onCommentsChange} parent={null} />}
      </div>

      <AlertDialog open={open} onOpenChange={setOpen}>
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
