import { baseUrl } from '../App'
import { jwtDecode } from 'jwt-decode';

export const regUser = async formData => {
    try {
        const res = await fetch(`${baseUrl}registerUser`, {
            method: 'POST',
            body: formData
        })

        const data = await res.json()
        console.log('res', data)

        return { ok: res.ok, data }
    } catch (error) {
        console.log('error:', error.message)
        return { ok: false, error: error.message }
    }
}

export const loginUser = async (userData, userCart) => {
    try {  
        //make req
        const res = await fetch(`${baseUrl}loginUser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',

            },
            body: JSON.stringify(userData)
        })

        //get response
        const data = await res.json()
        console.log(data);

        let token = res.headers.get('authorization') || data.token
        //remove Bearer
        if (token && token.startsWith('Bearer ')) {
            token = token.split(' ')[1]
        }
        console.log('token', token)
        const decoded = jwtDecode(token)
        console.log('decoded', decoded)

        if (userCart.length > 0) {
            await Promise.all(
                userCart.map(async item => {
                    const response = await fetch(`${baseUrl}addcart`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: ` Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            userid: decoded.userid,
                            productid: item?.id,
                            color: item?.color,
                            size: item?.size,
                            quantity: item?.quantity
                        })
                    })

                    const cartRes = await response.json()
                    console.log('cartRes', cartRes)
                })
            )
        }

        return { ok: res.ok, data, token, decoded }
    } catch (error) {
        console.log('error', error.message)
        return { ok: false, error: error.message }
    }
}