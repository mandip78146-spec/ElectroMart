export const getStoredToken = () => {
    const rawToken = localStorage.getItem("data");
    if (!rawToken) {
        return "";
    }

    try {
        const parsedToken = JSON.parse(rawToken);
        return typeof parsedToken === "string" ? parsedToken : "";
    } catch (error) {
        return rawToken;
    }
};

export const getAuthHeaders = () => {
    const token = getStoredToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const clearStoredToken = () => {
    localStorage.removeItem("data");
};
