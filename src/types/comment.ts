export interface Comment {
  parent: number;
  commentNum: number;
  commentBody: string;
  commentingDate: string;
  id: string;
  user: string;
}

export interface CommentProps {
  comments: Array<Comment>;
  onCommentsChange: React.Dispatch<React.SetStateAction<Array<Comment>>>;
  className?: string;
}
