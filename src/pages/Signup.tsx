import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
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
import { Separator } from '@/components/ui/separator';
import formSchema from '@/schemas/user';

export default function Signup() {
  const [dialog, setDialog] = React.useState({
    open: false,
    title: '제목',
    description: '내용',
    action: '확인',
    next: '',
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);

    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });

    if (response.status === 401) {
      const data = await response.json();
      setDialog((prev) => ({ ...prev, open: true }));
      setDialog({
        open: true,
        title: '회원가입 실패',
        description: data.message,
        action: '확인',
        next: '',
      });
    } else if (!response.ok) {
      console.log(response);
      setDialog({
        open: true,
        title: '회원가입 실패',
        description: '회원가입에 실패하였습니다. 관리자에게 문의하세요',
        action: '확인',
        next: '',
      });
    } else {
      const data = await response.json();
      console.log(data);
      form.reset({
        id: '',
        password: '',
        confirmPassword: '',
        nickname: '',
        email: '',
      });
      setDialog({
        open: true,
        title: '회원가입 성공',
        description: '아주대 개발자 커뮤니티에 오신걸 환영합니다',
        action: '로그인 페이지로 이동',
        next: '/login',
      });
    }
  }

  return (
    <>
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">회원가입</CardTitle>
          <CardDescription>아주대 개발자 커뮤니티에 가입하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>아이디</FormLabel>
                        <FormControl>
                          <Input placeholder="아이디를 입력해주세요 (최대 32자)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>비밀번호</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="비밀번호를 입력해주세요" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input type="password" placeholder="비밀번호를 확인해주세요" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormDescription>영문, 숫자, 특수문자를 포함 10자 이상 32자 이하</FormDescription>
                </div>
                <Separator />
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="nickname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>닉네임</FormLabel>
                        <FormControl>
                          <Input placeholder="닉네임을 입력해주세요 (최대 32자)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>이메일</FormLabel>
                        <FormControl>
                          <Input placeholder="email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2 mt-4">
                  <Button type="submit" className="w-full">
                    회원가입
                  </Button>
                </div>
              </div>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            이미 계정이 있으신가요?{' '}
            <Link to="/login" className="underline">
              로그인
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
