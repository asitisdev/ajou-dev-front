import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { useDialog } from '@/hooks/useDialog';
import formSchema from '@/schemas/user';

export default function Mypage() {
  const { setDialog } = useDialog();
  const { user, setUser, fetchAuth } = useAuth();
  const [open, setOpen] = React.useState(false);
  const [password, setPassword] = React.useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  React.useEffect(() => {
    form.reset({
      id: user.id,
      nickname: user.nickname,
      password: 'DEFAULT_PASSW0RD',
      confirmPassword: 'DEFAULT_PASSW0RD',
      email: user.email,
    });
  }, [user, form]);

  const onSubmit = async () => {
    setOpen(true);
  };

  const handleConfirm = async () => {
    setPassword('');
    setOpen(false);

    const values = Object.fromEntries(
      Object.entries(form.getValues()).filter(([key, value]) => key in user && value !== user[key as keyof typeof user])
    );

    if (Object.keys(values).length === 0) {
      toast.error('변경된 정보가 없습니다');
      return;
    }

    const data = await fetchAuth('/api/member/edit', 'POST', { ...values, password });

    if (data.status === 'success') {
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      toast.success('회원 정보 변경 성공');
    } else {
      setDialog({
        open: true,
        title: '회원 정보 변경 실패',
        description: data.message,
        action: '확인',
        next: '#',
      });
    }
  };

  return (
    <>
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">마이 페이지</CardTitle>
          <CardDescription>회원 정보를 수정하세요</CardDescription>
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
                    회원 정보 수정
                  </Button>
                </div>
              </div>
            </form>
          </Form>

          <div className="text-center text-sm mt-4">
            비밀번호를 바꾸고 싶다면?{' '}
            <Link to="/changepw" className="underline">
              비밀번호 변경
            </Link>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>비밀번호 확인</DialogTitle>
            <DialogDescription>
              정말 회원 정보를 수정하시겠습니까? 수정하시려면 비밀번호를 입력해주세요.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-4">
            <Label htmlFor="password" className="text-right">
              비밀번호
            </Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="col-span-3"
            />
          </div>
          <DialogFooter>
            <Button onClick={handleConfirm}>수정</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
