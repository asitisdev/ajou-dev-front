import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function relativeTime(timestamp: string): string {
  const timeElapsed = Math.floor((new Date().getTime() - new Date(timestamp).getTime()) / 1000);

  if (timeElapsed < 60) return '방금 전';
  if (timeElapsed < 3600) return `${Math.floor(timeElapsed / 60)}분 전`;
  if (timeElapsed < 86400) return `${Math.floor(timeElapsed / 3600)}시간 전`;
  if (timeElapsed < 604800) return `${Math.floor(timeElapsed / 86400)}일 전`;
  return new Date(timestamp).toISOString().slice(0, 10);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);

  return date
    .toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
    .replace(',', '');
}
