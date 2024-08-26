import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Wrench, Search, UserRound, MessageCircle, MessageCircleQuestion, Users, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetHeader, SheetTitle, SheetDescription, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { Dialog } from '@/hooks/useDialog';
import { cn } from '@/lib/utils';

export default function Root() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuth, user, logout } = useAuth();
  const [open, setOpen] = React.useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const keyword = new FormData(form).get('keyword');

    navigate(`/search/?keyword=${keyword}`);
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="block md:hidden">
            <Menu className="h-6 w-6" />
          </SheetTrigger>
          <SheetContent side={'left'} className="p-4">
            <SheetHeader>
              <SheetTitle className="text-xl">
                <Wrench className="inline mr-2 h-6 w-6" />
                <Link to="/" onClick={() => setOpen(false)}>
                  아주데브
                </Link>
              </SheetTitle>
              <SheetDescription>아주대 개발자 커뮤니티</SheetDescription>
            </SheetHeader>
            <nav className="grid items-start py-4">
              <Link
                to="/freeboard"
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary',
                  location.pathname.startsWith('/freeboard') ? 'bg-muted text-primary' : 'text-muted-foreground'
                )}
                onClick={() => setOpen(false)}
              >
                <MessageCircle className="h-5 w-5" />
                자유게시판
              </Link>
              <Link
                to="/question"
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary',
                  location.pathname.startsWith('/question') ? 'bg-muted text-primary' : 'text-muted-foreground'
                )}
                onClick={() => setOpen(false)}
              >
                <MessageCircleQuestion className="h-5 w-5" />
                질문게시판
              </Link>
              <Link
                to="collaboration"
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary',
                  location.pathname.startsWith('/collaboration') ? 'bg-muted text-primary' : 'text-muted-foreground'
                )}
                onClick={() => setOpen(false)}
              >
                <Users className="h-5 w-5" />
                구인게시판
              </Link>
              <Link
                to="/resource"
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary',
                  location.pathname.startsWith('/resource') ? 'bg-muted text-primary' : 'text-muted-foreground'
                )}
                onClick={() => setOpen(false)}
              >
                <Paperclip className="h-5 w-5" />
                자료게시판
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        <Link to="/" className="flex items-center gap-2 text-lg font-semibold md:text-base">
          <Wrench className="h-6 w-6" />
          <span className="whitespace-nowrap">아주데브</span>
        </Link>
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            to="/freeboard"
            className="text-muted-foreground transition-colors hover:text-foreground whitespace-nowrap"
          >
            자유게시판
          </Link>
          <Link
            to="/question"
            className="text-muted-foreground transition-colors hover:text-foreground whitespace-nowrap"
          >
            질문게시판
          </Link>
          <Link
            to="/collaboration"
            className="text-muted-foreground transition-colors hover:text-foreground whitespace-nowrap"
          >
            구인게시판
          </Link>
          <Link
            to="/resource"
            className="text-muted-foreground transition-colors hover:text-foreground whitespace-nowrap"
          >
            자료게시판
          </Link>
        </nav>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <form onSubmit={onSubmit} className="ml-auto flex-1 sm:flex-initial">
            <div className="relative hidden md:flex">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" name="keyword" placeholder="검색..." className="pl-8 md:w-[170px] lg:w-[300px]" />
            </div>
          </form>
          {isAuth ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="cursor-pointer">
                <Avatar className="w-10 h-10 border">
                  <AvatarImage
                    src={user?.id && import.meta.env.VITE_API_URL + `/api/file/profile/download?user=${user?.id}`}
                    alt={user?.nickname}
                  />
                  <AvatarFallback>{user?.nickname.charAt(0)}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/mypage" className="font-semibold">
                    {user?.nickname}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to={`/members/${user?.id}/posts`}>내가 쓴 게시글</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to={`/members/${user?.id}/comments`}>내가 쓴 댓글</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to={`/members/${user?.id}/likes`}>나의 좋아요 목록</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()} className="cursor-pointer">
                  로그아웃
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login">
              <Button variant="secondary">
                <UserRound className="h-5 w-5" />
                <span className="ml-2 hidden md:inline">로그인</span>
              </Button>
            </Link>
          )}
        </div>
      </header>
      <main className="flex items-center min-h-[calc(100vh_-_theme(spacing.16))] w-full flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <Outlet />
      </main>
      <Toaster />
      <Dialog />
    </div>
  );
}
