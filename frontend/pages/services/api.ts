import axios from "axios";

const baseUrl = "http://localhost:4000/api";
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
    }
});

export { api, formApi, appApi };