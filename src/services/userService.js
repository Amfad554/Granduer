import { baseUrl } from '../App'
import { jwtDecode } from 'jwt-decode';

export const regUser = async (formData) => {
    try {
        const res = await fetch(`${baseUrl}register`, {
            method: 'POST',
            body: formData
        });

        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            return { ok: false, error: "Server error or route not found" };
        }

        const data = await res.json();
        return { ok: res.ok, data };

    } catch (error) {
        return { ok: false, error: error.message };
    }
};

export const loginUser = async (userData, userCart) => {
    try {
        const res = await fetch(`${baseUrl}login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });

        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            return { ok: false, error: "Server error or route not found" };
        }

        if (!res.ok) {
            const errorData = await res.json();
            return { ok: false, data: errorData };
        }

        const data = await res.json();

        const token = data.token;
        if (!token) {
            return { ok: false, error: "No token received" };
        }

        const decoded = jwtDecode(token);

        // Sync guest cart to server after login
        if (userCart && userCart.length > 0) {
            const cartResults = await Promise.allSettled(
                userCart.map(item =>
                    fetch(`${baseUrl}addcart`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            userid: decoded.userid,
                            productid: item?.id,
                            color: item?.color,
                            size: item?.size,
                            quantity: item?.quantity,
                        })
                    })
                )
            );

            const failedItems = cartResults.filter(r => r.status === 'rejected');
            if (failedItems.length > 0) {
                console.warn(`${failedItems.length} cart item(s) failed to sync`);
            }
        }

        return { ok: true, data, token, decoded };

    } catch (error) {
        console.error('Login error:', error.message);
        return { ok: false, error: error.message };
    }
};