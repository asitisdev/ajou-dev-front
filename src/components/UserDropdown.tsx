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
  nickname: string | null;
  id: string | null;
  className?: string;
}

export default function UserDropdown({ nickname, id, className }: Props) {
  return (
    <>
      {nickname === null && id === null ? (
        <span className={className}>익명</span>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger className={className}>{nickname}</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{`${nickname} (${id})`}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link to={`/members/${id}/posts`}>작성한 게시글</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link to={`/members/${id}/comments`}>작성한 댓글</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
}
