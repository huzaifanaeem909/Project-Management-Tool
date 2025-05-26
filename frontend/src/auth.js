export const getAccessToken = () => localStorage.getItem("accessToken");

export const isAuthenticated = () => !!getAccessToken();

export const clearAccessToken = () => {
    localStorage.removeItem("accessToken");
};
