import React from 'react';
import { useParams } from 'react-router-dom';
import { Pencil, CornerDownRight } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { CommentProps } from '@/types';

export default function CommentView({ onCommentsChange, parent }: CommentProps & { parent: number | null }) {
  const { isAuth, fetchAuth } = useAuth();
  const { postNum } = useParams();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const comment = new FormData(form).get('comment');

    if (comment) {
      if (parent === null) {
        const data = await fetchAuth(`/api/comment/create?post=${postNum}`, 'POST', { commentBody: comment });
        onCommentsChange(data.comments.content);
        form.reset();
        toast.success('댓글을 작성했습니다');
      } else {
        const data = await fetchAuth(`/api/comment/reply/create`, 'POST', { commentBody: comment, parent });
        onCommentsChange(data.comments.content);
        form.reset();
        toast.success('대댓글을 작성했습니다');
      }
    } else {
      toast.error('댓글 내용을 입력해주세요');
    }
  }

  return (
    <div className="flex gap-2">
      {!!parent && <CornerDownRight className="w-4 h-4 mt-2 block" />}
      <div className="space-y-4 w-full">
        <form onSubmit={onSubmit} className="w-full flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
          <Input
            name="comment"
            placeholder={
              isAuth ? (parent ? '대댓글을 입력하세요' : '댓글을 입력하세요') : '댓글을 작성하시려면 로그인하세요'
            }
            disabled={!isAuth}
            className="py-6 px-4"
          />
          <Button type="submit" className="flex items-center py-6 px-4" disabled={!isAuth}>
            <Pencil className="mr-2 w-4 h-4" />
            <span>{parent ? '대댓글 작성하기' : '댓글 작성하기'}</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
