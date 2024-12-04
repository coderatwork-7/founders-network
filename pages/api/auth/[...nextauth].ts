import CredentialsProvider from 'next-auth/providers/credentials';
import NextAuth, {NextAuthOptions, Session} from 'next-auth';
import axios from 'axios';
import logger from '@/services/logger';
import {
  LOGIN_API_URL,
  REFRESH_JWT_TOKEN_API_URL
} from '@/utils/common/constants';
import {getTokenExpirationTimeInMinutes} from '@/utils/common/helper';

interface TokenResponse {
  data: {
    token: {
      refresh: string;
      refreshExpirationTime: string;
      access: string;
      accessExpirationTime: string;
    };
    onboarding: any;
  };
}

interface SessionProps {
  token: Session['user'];
  user: Session['user'];
}

async function refreshAccessToken({...tokenObject}: Session['user']) {
  try {
    // Get a new set of tokens with a refreshToken
    const url = `${process.env.NEXT_PUBLIC_API_DOMAIN_URL}${REFRESH_JWT_TOKEN_API_URL}`;
    const tokenResponse: TokenResponse = await axios.post(url, {
      refresh: tokenObject.tokens.refresh
    });
    return {
      ...tokenObject,
      onboarding: {
        ...tokenObject.onboarding,
        status: {
          ...tokenResponse.data.onboarding
        }
      },
      tokens: {
        ...tokenResponse.data.token
      }
    };
  } catch (error: any) {
    logger.error(error?.stack);
    logger.error(`RefreshAccessTokenError: ${JSON.stringify(tokenObject)}`);
    return {
      ...tokenObject,
      error: 'RefreshAccessTokenError'
    };
  }
}

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    // ...add more providers here
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: 'Credentials',
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: {label: 'Username', type: 'text'},
        password: {label: 'Password', type: 'password'}
      },

      async authorize(credentials) {
        const {username, password} = credentials as any;
        let user = null;
        const url = `${process.env.NEXT_PUBLIC_API_DOMAIN_URL}${LOGIN_API_URL}`;
        logger.info(`URL: ${url}`);
        logger.info(`User Creds: ${JSON.stringify(credentials)}`);
        await axios
          .post(url, {
            username: username,
            password: password
          })
          .then(response => {
            user = response.data;
          })
          .catch(error => {
            logger.error(error.stack);
            logger.error(`${JSON.stringify(error.response.data)}`);
            return error.response.data;
          });
        return user;
      }
    })
  ],
  callbacks: {
    async redirect({url, baseUrl}) {
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    async jwt({token, trigger, user, session}: SessionProps) {
      if (trigger === 'update') {
        Object.keys(session).forEach(key => {
          (token as any)[key] = session[key];
        });
      }

      if (user) {
        return Promise.resolve({...token, ...user});
      }
      const accessTokenExpiry = token?.tokens.accessExpirationTime;
      const shouldRefreshTime =
        getTokenExpirationTimeInMinutes(accessTokenExpiry);
      // If the token is still valid, just return it.
      if (shouldRefreshTime >= 1) {
        return Promise.resolve({...token});
      }
      return await refreshAccessToken(token);
    },
    async session({session, token}) {
      // Send properties to the client, like an access_token from a provider.
      session.user = token as any;
      return session;
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  pages: {
    signIn: '/accounts/login',
    error: '/login'
  }
};

export default NextAuth(authOptions);
