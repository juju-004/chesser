import type { User } from "@chessu/types";
import { createContext, Dispatch, SetStateAction } from "react";

export const SessionContext = createContext<{
    user: User | null | string | undefined; // undefined = hasn't been checked yet, null = no user
    setUser: Dispatch<SetStateAction<User | null | string>>;
} | null>(null);
