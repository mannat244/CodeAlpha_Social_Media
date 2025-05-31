export const sessionOptions = {
  password: process.env.SESSION_PASSWORD, // 32+ chars strong secret
  cookieName: 'synq_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};
