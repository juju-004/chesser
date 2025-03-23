import { API_URL } from "@/config";
import type { User } from "@chessu/types";
import axios from "axios";
import { clientErrorHandler } from "./handlers";

export const fetchSession = () =>
    clientErrorHandler(async () => {
        const { data } = await axios.get(`${API_URL}/v1/auth/getuser`);
        return data;
    });

export const login = (name: string, password: string) =>
    clientErrorHandler(async () => {
        const { data } = await axios.post(`${API_URL}/v1/auth/login`, { name, password });
        return data;
    });

export const register = (name: string, password: string, email: string) =>
    clientErrorHandler(async () => {
        const { data } = await axios.post(`${API_URL}/v1/auth/register`, { name, password, email });
        return data;
    });

export const updateUser = (name?: string, email?: string, password?: string) =>
    clientErrorHandler(async () => {
        const { data } = await axios.patch(`${API_URL}/v1/auth/`, { name, email, password });
        return data;
    });

export const logout = () =>
    clientErrorHandler(async () => {
        const { data } = await axios.post(`${API_URL}/v1/auth/logout`);
        return data;
    });

export const resendMail = (email: string) =>
    clientErrorHandler(async () => {
        const { data } = await axios.post(`${API_URL}/v1/auth/resendmail`, { email });
        return data;
    });

export const verifyMail = (token: string) =>
    clientErrorHandler(async () => {
        const { data } = await axios.post(`${API_URL}/v1/auth/verifymail`, { token });
        return data;
    });

export const sendForgotPassMail = (email: string, password: string) =>
    clientErrorHandler(async () => {
        const { data } = await axios.post(`${API_URL}/v1/auth/forgotpassmailsend`, {
            email,
            password
        });
        return data;
    });

export const verifyForgotPassMail = (token: string) =>
    clientErrorHandler(async () => {
        const { data } = await axios.post(`${API_URL}/v1/auth/forgotpassmailverify`, { token });
        return data;
    });
