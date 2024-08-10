import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Login() {
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">로그인</CardTitle>
        <CardDescription>아이디와 비밀번호를 입력해주세요</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">아이디</Label>
            <Input id="email" type="email" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input id="password" type="password" required />
          </div>
          <div className="grid gap-2 mt-4">
            <Button className="w-full">로그인</Button>
          </div>
        </div>
        <div className="text-center text-sm mt-4">
          계정이 없으시다면? 지금 바로{' '}
          <Link to="/signup" className="underline">
            회원가입
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
