import { notFound } from 'next/navigation';

// 捕获proxy下所有未知路由
export default function CatchAllPage() {
  notFound();
}
