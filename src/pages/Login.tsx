import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useDialog } from '@/hooks/useDialog';

interface LoginFormInputs {
  id: string;
  password: string;
}

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { setDialog } = useDialog();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  async function onSubmit(values: LoginFormInputs) {
    if (await login(values)) {
      navigate('/');
    } else {
      setDialog({
        open: true,
        title: '로그인 실패',
        description: '로그인에 실패하였습니다. 아이디와 비밀번호를 확인하세요',
        action: '확인',
        next: '#',
      });
    }
  }

  return (
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
              <Input id="password" type="password" {...register('password', { required: '비밀번호를 입력해주세요' })} />
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
  );
}
