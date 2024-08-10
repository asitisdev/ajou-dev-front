import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

export default function Signup() {
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">회원가입</CardTitle>
        <CardDescription>아주대 개발자 커뮤니티에 가입하세요</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="id">아이디</Label>
            <Input id="id" type="id" placeholder="아이디를 입력해주세요" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input id="password" placeholder="비밀번호를 입력해주세요" type="password" />
            <Input id="password" placeholder="비밀번호를 확인해주세요" type="password" />
          </div>
          <Separator />
          <div className="grid gap-2">
            <Label htmlFor="nickname">닉네임</Label>
            <Input id="nickname" placeholder="닉네임을 입력해주세요 (최대 32자)" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">이메일</Label>
            <Input id="email" placeholder="이메일을 입력해주세요" required />
          </div>
          <Button type="submit" className="w-full">
            회원가입
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          이미 계정이 있으신가요?{' '}
          <Link href="#" className="underline">
            로그인
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
