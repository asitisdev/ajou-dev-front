export interface Question {
  postNum: number;
  title: string;
  textBody: string;
  user: string | null;
  id: string | null;
  liked: boolean;
  like: number;
  visit: number;
  postingDate: string;
  comment: number;
  answer: number;
}

export interface Answer {
  postNum: number;
  title: string;
  textBody: string;
  user: string;
  id: string;
  isLiked: boolean;
  isDisliked: boolean;
  like: number;
  dislike: number;
  postingDate: string;
  comment: number;
}

export interface AnswerProps {
  onAnswersChange: React.Dispatch<React.SetStateAction<Array<Answer>>>;
  className?: string;
}
