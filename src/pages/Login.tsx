import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';

interface LoginFormInputs {
  id: string;
  password: string;
}

export default function Login() {
  const { login } = useAuth();
  const [dialog, setDialog] = React.useState({
    open: false,
    title: '제목',
    description: '내용',
    action: '확인',
    next: '',
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  async function onSubmit(values: LoginFormInputs) {
    if (await login(values)) {
      setDialog({
        open: true,
        title: '로그인 성공',
        description: '아주대 개발자 커뮤니티에 오신걸 환영합니다',
        action: '확인',
        next: '/',
      });
    } else {
      setDialog({
        open: true,
        title: '로그인 실패',
        description: '로그인에 실패하였습니다. 아이디와 비밀번호를 확인하세요',
        action: '확인',
        next: '',
      });
    }
  }

  return (
    <>
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">로그인</CardTitle>
          <CardDescription>아이디와 비밀번호를 입력해주세요</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">아이디</Label>
                <Input id="id" type="text" {...register('id', { required: '아이디를 입력해주세요' })} />
                {errors.id && <p className="text-sm font-medium text-destructive">{errors.id.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">비밀번호</Label>
                <Input
                  id="password"
                  type="password"
                  {...register('password', { required: '비밀번호를 입력해주세요' })}
                />
                {errors.password && <p className="text-sm font-medium text-destructive">{errors.password.message}</p>}
              </div>
              <div className="grid gap-2 mt-4">
                <Button type="submit" className="w-full">
                  로그인
                </Button>
              </div>
            </div>
          </form>

          <div className="text-center text-sm mt-4">
            계정이 없으시다면? 지금 바로{' '}
            <Link to="/signup" className="underline">
              회원가입
            </Link>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={dialog.open} onOpenChange={(open) => setDialog((prev) => ({ ...prev, open }))}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dialog.title}</AlertDialogTitle>
            <AlertDialogDescription>{dialog.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Link to={dialog.next}>
              <AlertDialogAction autoFocus>{dialog.action}</AlertDialogAction>
            </Link>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
