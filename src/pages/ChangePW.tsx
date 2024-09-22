import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { useDialog } from '@/hooks/useDialog';

const formSchema = z
  .object({
    password: z
      .string({ required_error: '현재 비밀번호는 필수 입력 항목입니다' })
      .regex(/^(?=.*[a-zA-Z])/, '비밀번호는 영문자를 포함해야 합니다')
      .regex(/^(?=.*\d)/, '비밀번호는 숫자를 포함해야 합니다')
      .regex(/^(?=.*[\W_])/, '비밀번호는 특수문자를 포함해야 합니다')
      .min(10, {
        message: '비밀번호 길이는 최소 10 글자입니다',
      })
      .max(32, {
        message: '비밀번호 길이는 최대 32 글자입니다',
      }),
    newPassword: z
      .string({ required_error: '변경할 비밀번호는 필수 입력 항목입니다' })
      .regex(/^(?=.*[a-zA-Z])/, '비밀번호는 영문자를 포함해야 합니다')
      .regex(/^(?=.*\d)/, '비밀번호는 숫자를 포함해야 합니다')
      .regex(/^(?=.*[\W_])/, '비밀번호는 특수문자를 포함해야 합니다')
      .min(10, {
        message: '비밀번호 길이는 최소 10 글자입니다',
      })
      .max(32, {
        message: '비밀번호 길이는 최대 32 글자입니다',
      }),
    confirmNewPassword: z.string({ required_error: '변경할 비밀번호를 다시 입력해주세요' }),
  })
  .refine((data) => data.password !== data.newPassword, {
    path: ['newPassword'],
    message: '현재 비밀번호와 일치합니다',
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    path: ['confirmNewPassword'],
    message: '비밀번호가 일치하지 않습니다',
  });

export default function ChangePW() {
  const navigate = useNavigate();
  const { setDialog } = useDialog();
  const { fetchAuth } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const data = await fetchAuth('/api/member/edit', 'POST', { ...values });

    if (data.status === 'success') {
      toast.success('비밀번호 변경 성공');
      navigate('/mypage');
    } else {
      setDialog({
        open: true,
        title: '비밀번호 변경 실패',
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
          <CardTitle className="text-2xl">비밀번호 변경</CardTitle>
          <CardDescription>비밀번호를 변경합니다</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>현재 비밀번호</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="현재 비밀번호를 입력해주세요" {...field} />
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
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>변경할 비밀번호</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="변경할 비밀번호를 입력해주세요" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="confirmNewPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>비밀번호 확인</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="변경할 비밀번호를 확인해주세요" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2 mt-4">
                  <Button type="submit" className="w-full">
                    비밀번호 변경
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
