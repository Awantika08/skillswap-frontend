import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith('/admin');
  const isMentorRoute = pathname.startsWith('/mentor');
  const isLearnerRoute = pathname.startsWith('/learner');

  // If it's not a protected route, let it pass
  if (!isAdminRoute && !isMentorRoute && !isLearnerRoute) {
    return NextResponse.next();
  }

  const userCookie = request.cookies.get('user');
  let user: any = null;
  let role: string | null = null;

  if (userCookie) {
    try {
      // Sometimes cookies are URI encoded
      user = JSON.parse(decodeURIComponent(userCookie.value));
      role = user?.role?.toLowerCase() || null;
    } catch (e) {
      try {
        user = JSON.parse(userCookie.value);
        role = user?.role?.toLowerCase() || null;
      } catch (err) {
        console.error("Failed to parse user cookie in middleware");
      }
    }
  }

  // If no user/role, redirect to login
  if (!role) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Admin restricting
  if (role === 'admin' && !isAdminRoute) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  // Mentor restricting
  if (role === 'mentor' && !isMentorRoute) {
    return NextResponse.redirect(new URL('/mentor/dashboard', request.url));
  }

  // Learner restricting
  if (role === 'learner' && !isLearnerRoute) {
    return NextResponse.redirect(new URL('/learner/dashboard', request.url));
  }

  // If role is unrecognized, redirect to login
  if (!['admin', 'mentor', 'learner'].includes(role)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/mentor/:path*',
    '/learner/:path*',
  ],
};
