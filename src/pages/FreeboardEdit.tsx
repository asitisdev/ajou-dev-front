import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import formSchema from '@/schemas/freeboard';

export default function FreeboardEdit() {
  const { postNum } = useParams();
  const { fetchAuth } = useAuth();
  const navigation = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  React.useEffect(() => {
    const fetchData = async () => {
      const data = await fetch(import.meta.env.VITE_API_URL + `/api/normal?post=${postNum}`, { method: 'GET' }).then(
        (response) => response.json()
      );

      form.setValue('title', data.post.title, { shouldValidate: true });
      form.setValue('textBody', data.post.textBody, { shouldValidate: true });
    };

    fetchData();
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const data = await fetchAuth(`/api/normal/edit?post=${postNum}`, 'POST', values);

    if (data.status === 'success') {
      navigation(`/freeboard/${postNum}`);
      toast.success('게시글 수정 완료', { description: '게시글을 수정하였습니다' });
    } else {
      toast.success('게시글 수정 실패', { description: '게시글 수정에 실패하였습니다. 관리자에게 문의하세요.' });
    }
  }

  return (
    <Card className="w-full max-w-2xl lg:max-w-4xl xl:max-w-7xl">
      <CardHeader>
        <CardTitle className="text-2xl">자유게시판 게시글 수정하기</CardTitle>
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
  );
}
