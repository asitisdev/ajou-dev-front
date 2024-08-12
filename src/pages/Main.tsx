import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function Main() {
  return (
    <Card className="w-full max-w-2xl lg:max-w-5xl xl:max-w-7xl">
      <CardHeader>
        <CardTitle>아주대 개발자 커뮤니티 - Ajou Devhub</CardTitle>
      </CardHeader>
      <CardContent>아주대 개발자 커뮤니티입니다</CardContent>
    </Card>
  );
}
