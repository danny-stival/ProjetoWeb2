import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api"
});

api.interceptors.request.use(config => {

    const token = localStorage.getItem("token");

    const rotaPublica =
        config.url?.startsWith("/auth/");

    if (token && !rotaPublica) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(

    response => response,

    erro => {

        const rotaPublica =
            erro.config?.url?.startsWith("/auth/");

        if (
            erro.response?.status === 401 &&
            !rotaPublica &&
            localStorage.getItem("token")
        ) {

            localStorage.removeItem("token");

            window.location.reload();
        }

        return Promise.reject(erro);
    }
);

export default api;
