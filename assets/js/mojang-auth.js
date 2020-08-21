'use strict';

const authApi = 'https://authserver.mojang.com'

$.ajaxSetup({
    global: false,
    method: 'POST',
    url: authApi,
    headers: {
        'Content-Type': 'application/json'
    }
});

const login = async (user, password) => {
    return new Promise((res, rej) => {
        console.log(`logging in...`)
        setTimeout(() => {
            if (user === 'abc' && password === '123') {
                const token = $.guid()
                window.sessionStorage.setItem('el.mojang.token', token)
                console.log(`login success: ${user}:${password}`)
                console.log(`token: ${token}`)
                res('Tester')
            }else{
                rej('Invalid Username or Password: '+$.guid())
            }
        }, 3000)
    })
};
