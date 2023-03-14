import axios from "axios";

// export const baseUrl = "http://localhost:4000/api";
export const baseUrl = "https://asia-northeast3-blog-next-c18f3.cloudfunctions.net/api/api/";
// export const baseUrl = "http://127.0.0.1:5001/blog-next-c18f3/asia-northeast3/api/api/";

export const nextBaseUrl = "http://localhost:3000/api";

const api = axios.create({
    baseURL: baseUrl,
    headers: {}
});

const formApi = axios.create({
    baseURL: baseUrl,
    headers: {
        "Content-Type": "multipart/form-data"
    }
});

const appApi = axios.create({
    baseURL: baseUrl,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true
});

export { api, formApi, appApi };