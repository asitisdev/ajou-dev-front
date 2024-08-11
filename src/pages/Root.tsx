import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { CircleUser, Package2, Search } from 'lucide-react';
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

export default function Root() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link to="/" className="flex items-center gap-2 text-lg font-semibold md:text-base">
            <Package2 className="h-6 w-6" />
            <span className="sr-only">아주대 개발자 커뮤니티</span>
          </Link>
          <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground whitespace-nowrap">
            자유게시판
          </Link>
          <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground whitespace-nowrap">
            질문게시판
          </Link>
          <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground whitespace-nowrap">
            구인게시판
          </Link>
          <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground whitespace-nowrap">
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">사용자 메뉴 열기</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>내 정보</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>내가 쓴 게시글</DropdownMenuItem>
              <DropdownMenuItem>내가 쓴 댓글</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>로그아웃</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="flex flex-justify-center items-center min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <Outlet />
      </main>
    </div>
  );
}
