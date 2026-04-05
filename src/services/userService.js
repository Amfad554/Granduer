import { baseUrl } from '../App'
import { jwtDecode } from 'jwt-decode';

export const regUser = async formData => {
    try {
        // CHANGED: 'registerUser' -> 'register'
        const res = await fetch(`${baseUrl}register`, {
            method: 'POST',
            body: formData
        })

        // Safety check: If server sends HTML (404), don't try to parse as JSON
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const text = await res.text();
            return { ok: false, error: "Server error or route not found" };
        }

        const data = await res.json()
        return { ok: res.ok, data }
    } catch (error) {
        return { ok: false, error: error.message }
    }
}

export const loginUser = async (userData, userCart) => {
    try {  
        // CHANGED: Hardcoded localhost -> baseUrl
        // CHANGED: 'loginUser' -> 'login'
        const res = await fetch(`${baseUrl}login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        })

        if (!res.ok) {
            const errorData = await res.json();
            return { ok: false, data: errorData };
        }

        const data = await res.json()
        
        let token = data.token // Simplified: Get token directly from your JSON response
        
        if (!token) {
            return { ok: false, error: "No token received" };
        }

        const decoded = jwtDecode(token)

        // Sync Cart Logic
        if (userCart.length > 0) {
            await Promise.all(
                userCart.map(async item => {
                    await fetch(`${baseUrl}addcart`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`, // Removed leading space in template string
                        },
                        body: JSON.stringify({
                            userid: decoded.userid,
                            productid: item?.id,
                            color: item?.color,
                            size: item?.size,
                            quantity: item?.quantity
                        })
                    })
                })
            )
        }

        return { ok: res.ok, data, token, decoded }
    } catch (error) {
        console.log('error', error.message)
        return { ok: false, error: error.message }
    }
}