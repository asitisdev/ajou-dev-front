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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { useDialog } from '@/hooks/useDialog';
import formSchema from '@/schemas/user';

export default function Mypage() {
  const { setDialog } = useDialog();
  const { user, setUser, fetchAuth, logout, login } = useAuth();
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
    if (/^[ㄱ-ㅎ가-힣]*$/.test(password)) return;

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

      if (values.id) {
        await logout();
        await login({ id: data.user.id, password });
      }

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

  const onProfileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target && e.target.files) {
      const formData = new FormData();
      formData.append('file', e.target.files[0]);

      const data = await fetchAuth('/api/file/profile/upload', 'POST', formData);

      if (data.status === 'success') {
        toast.success('프로필 사진 업로드에 성공하였습니다.');
        window.location.reload();
      } else if (data.status === 'error') {
        toast.error('프로필 사진 업로드에 실패하였습니다.');
        console.error(data);
      }
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
          <div className="flex justify-center items-center my-4">
            <Avatar className="relative w-32 h-32 border">
              <AvatarImage
                src={user.id && import.meta.env.VITE_API_URL + `/api/file/profile/download?user=${user.id}`}
                alt={user.nickname}
              />
              <AvatarFallback className="text-5xl">{user.nickname.charAt(0)}</AvatarFallback>
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 cursor-pointer opacity-0"
                onChange={onProfileChange}
              />
            </Avatar>
          </div>
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
          <form onSubmit={(e) => e.preventDefault()} className="group grid gap-4">
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
                pattern="^[^ㄱ-ㅎ가-힣]*$"
                className="col-span-3"
              />
            </div>
            <p className="text-center text-sm font-medium text-destructive hidden duration-200 group-invalid:block group-invalid:animate-in group-invalid:fade-in-0">
              비밀번호는 영문, 숫자, 특수문자로 구성되어야 합니다
            </p>
            <DialogFooter>
              <Button
                type="submit"
                onClick={handleConfirm}
                className="group-invalid:pointer-events-none group-invalid:opacity-30"
              >
                수정
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
