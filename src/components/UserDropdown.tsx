import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Props {
  nickname: string;
  id: string;
  className?: string;
}

export default function UserDropdown({ nickname, id, className }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={className}>{nickname}</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{`${nickname} (${id})`}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to={`/members/${id}/posts`}>작성한 게시글</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to={`/members/${id}/comments`}>작성한 댓글</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
