import axios from "axios";

const baseUrl = "http://localhost:4000/api";

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

export { api, formApi };