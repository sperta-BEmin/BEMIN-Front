export function setUser(user) {
    if (typeof window !== "undefined") {
        localStorage.setItem('user', JSON.stringify(user));
        window.dispatchEvent(new Event("userChanged"));
    }
}

export function isLoggedIn() {
    if (typeof window === "undefined") return false; // 서버에서는 false 반환
    return !!localStorage.getItem('user');
}

export function getUserToken() {
    if (typeof window === "undefined") return null;
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user.token : null;
}

export function getUserNickname() {
    if (typeof window === "undefined") return null;
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user.nickname : null;
}

export function getUserEmail() {
    if (typeof window === "undefined") return null;
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user.email : null;
}

export function getUserRole() {
    if (typeof window === "undefined") return null;
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user.role : null;
}

export function setUserNickname(userNickname) {
    if (typeof window === "undefined") return null;

    let user = localStorage.getItem('user');

    if (!user) return null;

    user = JSON.parse(user);
    user.nickname = userNickname;

    localStorage.setItem('user', JSON.stringify(user));

    window.dispatchEvent(new Event("userChanged"));
}

export function logout() {
    if (typeof window !== "undefined") {
        localStorage.removeItem('user');
        window.dispatchEvent(new Event("userChanged"));
    }
}
