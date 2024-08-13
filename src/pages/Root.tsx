import { Outlet, Link, useNavigate } from 'react-router-dom';
import { CircleUser, Wrench, Search, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';

export default function Root() {
  const navigate = useNavigate();
  const { isAuth, user, logout } = useAuth();

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link to="/" className="flex items-center gap-2 text-lg font-semibold md:text-base">
            <Wrench className="h-6 w-6" />
            <span className="whitespace-nowrap">아주데브</span>
          </Link>
          <Link
            to="/freeboard"
            className="text-muted-foreground transition-colors hover:text-foreground whitespace-nowrap"
          >
            자유게시판
          </Link>
          <Link to="#" className="text-muted-foreground transition-colors hover:text-foreground whitespace-nowrap">
            질문게시판
          </Link>
          <Link to="#" className="text-muted-foreground transition-colors hover:text-foreground whitespace-nowrap">
            구인게시판
          </Link>
          <Link to="#" className="text-muted-foreground transition-colors hover:text-foreground whitespace-nowrap">
            자료게시판
          </Link>
        </nav>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <form className="ml-auto flex-1 sm:flex-initial">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="검색..." className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]" />
            </div>
          </form>
          {isAuth ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                  <CircleUser className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user.nickname}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>내가 쓴 게시글</DropdownMenuItem>
                <DropdownMenuItem>내가 쓴 댓글</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()}>로그아웃</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="secondary" onClick={() => navigate('/login')}>
              <LogIn className="h-5 w-5 mr-2" />
              <span>로그인</span>
            </Button>
          )}
        </div>
      </header>
      <main className="flex items-center min-h-[calc(100vh_-_theme(spacing.16))] w-full flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <Outlet />
      </main>
    </div>
  );
}
