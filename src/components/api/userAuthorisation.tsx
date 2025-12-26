export const userAuthorisation = async ({username,password}:{username:string,password:string}) => {
    const response = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: username,
            password: password,
            expiresInMins: 30,
        }),
    })
    return response.json();
}