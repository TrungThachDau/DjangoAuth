import { NextResponse } from 'next/server'

export async function middleware(request) {
    // const accessToken = request.cookies.get('accessToken')
    // const is_staff = request.cookies.get('is_staff')
    // //console.log('is_staff: ', is_staff.value)
    // console.log('accessToken: ', accessToken)
    // const refreshToken = request.cookies.get('refreshToken')
    // const { pathname } = request.nextUrl
    // // if (pathname.startsWith('/admin') && accessToken && refreshToken&& is_staff) {
    // //     return NextResponse.redirect(new URL('/', request.url))
    // // }
    // if (
    //     (pathname.startsWith('/customer') ||
    //         pathname.startsWith('/home') ||
    //         pathname.startsWith('/auth') ||
    //         pathname.startsWith('/admin') ||
    //      pathname.startsWith('/view')) &&
    //     (!accessToken || !refreshToken)
    // ) {
    //     return NextResponse.redirect(new URL('/auth/sign-in', request.url))
    // }
    // if (
    //     pathname.startsWith('/auth') &&
    //     accessToken && refreshToken
    // ) {
    //     return NextResponse.redirect(new URL('/', request.url))
    // }


    return NextResponse.next()
}

export const config = {
  matcher: [
    '/auth/:path*',
    '/customer/:path*',
    '/admin/:path*',
    '/home/:path*',
    '/view/:path*',
  ],
}