import { API_URL } from "@/config";
import { authApi } from "./api";

export const fetchSession = () => authApi.get(`${API_URL}/v1/auth`);

export const register = async (name: string, password: string, email?: string) =>
    authApi.post(`${API_URL}/v1/auth/register`, { name, password, email });

export const login = async (name: string, password: string) =>
    authApi.post(`${API_URL}/v1/auth/login`, { name, password });

export const updateUser = (name?: string, email?: string, password?: string) => {
    if (!name && !email && !password) return;
    authApi.patch(`${API_URL}/v1/auth/`, { name, email, password });
};

export const logout = () => authApi.post(`${API_URL}/v1/auth/logout`, {});

export const resendMail = (email: string) =>
    authApi.post(`${API_URL}/v1/auth/resendmail`, { email });

export const verifyMail = (token: string) =>
    authApi.post(`${API_URL}/v1/auth/verifymail`, { token });

export const sendForgotPassMail = (email: string, password: string) =>
    authApi.post(`${API_URL}/v1/auth/forgotpassmailsend`, {
        email,
        password
    });

export const verifyForgotPassMail = (token: string) =>
    authApi.post(`${API_URL}/v1/auth/forgotpassmailverify`, { token });
