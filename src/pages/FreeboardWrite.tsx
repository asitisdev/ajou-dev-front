import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
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
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import formSchema from '@/schemas/freeboard';

export default function FreeboardWrite() {
  const { postAuth } = useAuth();
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
    const data = await postAuth('/api/normal/create', values);

    if (data.status === 'success') {
      setDialog({
        open: true,
        title: '게시글 작성 완료',
        description: '게시글을 작성하였습니다',
        action: '확인',
        next: '/freeboard',
      });
    } else {
      setDialog({
        open: true,
        title: '게시글 작성 실패',
        description: '게시글 작성에 실패하였습니다. 관리자에게 문의하세요.',
        action: '확인',
        next: '',
      });
    }
  }

  return (
    <>
      <Card className="w-full max-w-2xl lg:max-w-4xl xl:max-w-7xl">
        <CardHeader>
          <CardTitle className="text-2xl">자유게시판 글쓰기</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>제목</FormLabel>
                        <FormControl>
                          <Input placeholder="제목을 작성해주세요" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="textBody"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>본문</FormLabel>
                        <FormControl>
                          <Textarea placeholder="본문을 작성해주세요" {...field} className="h-96" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2 mt-4">
                  <Button type="submit" className="w-full">
                    글쓰기
                  </Button>
                </div>
              </div>
            </form>
          </Form>
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
