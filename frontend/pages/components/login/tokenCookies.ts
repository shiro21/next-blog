export const setTokenCookie = async (token: string) => {
    await fetch("/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ token })
    })
}

export const removeTokenCookie = () => {
    fetch("/api/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({})
    })
};