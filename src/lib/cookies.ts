import { cookies } from 'next/headers';

const AUTH_TOKEN_NAME = 'tw-auth.token';

async function createAuthToken(value: any) {
    const cookieConfig = {
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
        httpOnly: true,
        secure: process.env.NEXT_PUBLIC_STAGE === 'production',
    };

    cookies().set(AUTH_TOKEN_NAME, value, cookieConfig);
}

async function destroyAuthToken() {
    cookies().delete(AUTH_TOKEN_NAME);
}

async function getAuthToken() {
    const cookie = cookies().get(AUTH_TOKEN_NAME);
    return cookie?.value;
}

const CookiesService = {
    createAuthToken,
    destroyAuthToken,
    getAuthToken,
};

export default CookiesService;
