import { z } from 'zod';

const schema = z.object({
  title: z
    .string({
      required_error: '제목을 작성해주세요',
    })
    .max(255, {
      message: '제목의 길이는 최대 255 글자입니다',
    }),
  textBody: z.string({
    required_error: '본문을 작성해주세요',
  }),
});

export default schema;
