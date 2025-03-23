import { User } from "@chessu/types";

type Body = {
    name?: string;
    password?: string;
    email?: string;
    token?: string;
};

const post = async (url: string, body: Body) => {
    try {
        const res = await fetch(url, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
        if (res.status === 200) {
            const user: User = await res.json();
            return user;
        } else if (res.status === 404 || res.status === 401 || res.status === 500) {
            const { message } = await res.json();
            return message as string;
        }
    } catch (err) {
        console.error(err);
    }
};

const get = async (url: string) => {
    try {
        const res = await fetch(url, {
            credentials: "include"
        });

        if (res && res.status === 200) {
            const user: User = await res.json();
            return user;
        }
    } catch (err) {
        // do nothing
    }
};

const patch = async (url: string, body: Body) => {
    try {
        const res = await fetch(url, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
        if (res.status === 200) {
            const user: User = await res.json();
            return user;
        } else if (res.status === 409) {
            const { message } = await res.json();
            return message as string;
        }
    } catch (err) {
        console.error(err);
    }
};

export const authApi = {
    post,
    get,
    patch
};
