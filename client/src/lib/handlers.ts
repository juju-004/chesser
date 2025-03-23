export const clientErrorHandler = async (fn: any) => {
    try {
        const data = await fn();
        return data;
    } catch (error: any) {
        console.log(error);

        return error?.response?.data?.message
            ? `${error?.response?.data?.message}`
            : "Something went wrong";
    }
};
