import { z } from 'zod';

const schema = z
  .object({
    id: z.string({ required_error: '아이디는 필수 입력 항목입니다' }).max(32, {
      message: '아이디 길이는 최대 32 글자입니다',
    }),
    password: z
      .string({ required_error: '비밀번호는 필수 입력 항목입니다' })
      .regex(/^(?=.*[a-zA-Z])/, '비밀번호는 영문자를 포함해야 합니다')
      .regex(/^(?=.*\d)/, '비밀번호는 숫자를 포함해야 합니다')
      .regex(/^(?=.*[\W_])/, '비밀번호는 특수문자를 포함해야 합니다')
      .min(10, {
        message: '비밀번호 길이는 최소 10 글자입니다',
      })
      .max(32, {
        message: '비밀번호 길이는 최대 32 글자입니다',
      }),
    confirmPassword: z.string({ required_error: '비밀번호를 다시 입력해주세요' }),
    nickname: z.string({ required_error: '닉네임은 필수 입력 항목입니다' }).max(32, {
      message: '닉네임 길이는 최대 32 글자입니다',
    }),
    email: z.string({ required_error: '이메일은 필수 입력 항목입니다' }).email({
      message: '잘못된 이메일 형식입니다',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: '비밀번호가 일치하지 않습니다',
  });

export default schema;
