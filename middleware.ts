export {default} from 'next-auth/middleware';

export const config = {
  matcher: [
    `/`,
    `/dashboard/:path`,
    `/home`,
    `/Home`,
    '/forum',
    '/forum/:path*',
    '/function',
    '/function/:path*',
    '/members',
    '/deals',
    '/nominate',
    '/partners',
    '/more',
    '/help',
    '/raise',
    '/profile/:path*',
    '/settings:query*',
    '/settings/:path*',
    '/guidelines',
    '/investors/:path',
    '/group/all',
    '/group/:path',
    '/investor',
    '/investors/form',
    '/404',
    '/search',
    '/library',
    '/library/:path',
    '/help-center/:path',
    `/fnstaff/:path`
  ]
};
