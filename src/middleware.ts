import { NextRequest, NextResponse } from 'next/server';
import { Routes } from './constants/routes';

export async function authMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const protectedRoutes = ['/proxy'];
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  const token = request.cookies.get('refreshToken');

  if ((pathname === '/login' || pathname === '/register') && token) {
    const url = new URL('/proxy/dashboard', request.url);
    return NextResponse.redirect(url);
  }

  if (isProtectedRoute && !token) {
    const url = new URL('/login', request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export async function roleMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const roleCookie = request.cookies.get('Role')?.value;

  // 从预定义的路由中查找当前路径
  const route = Routes.find(item => item.path === pathname);

  if (roleCookie && route) {
    const roleId = JSON.parse(roleCookie);

    if (roleId >= route.role_id) {
      return NextResponse.next();
    } else {
      // 权限不足，重定向到 dashboard
      const url = new URL('/proxy/dashboard', request.url);
      return NextResponse.redirect(url);
    }
  }

  // 如果没有匹配的路由或没有角色信息，允许继续执行
  return NextResponse.next();
}

export async function middleware(request: NextRequest) {

  const authRes = await authMiddleware(request);
  if (authRes.status === 307) {
    return authRes;
  }

  const roleRes = await roleMiddleware(request);
  if (roleRes) {
    return roleRes
  }

  return NextResponse.next();
}

// 配置中间件的应用范围
export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)', // 排除 API 和静态资源
};
