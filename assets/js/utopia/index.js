'use strict';

console.log('index.js loaded')

const $ = mdui.$;

const pageSettings = {
    enableCaching: false
}

const api = "https://cloudheavenapi.iw.gy"

$.ajaxSetup({
    global: true,
    method: 'POST',
    async: true,
    url: api,
    headers: {
        'Content-Type': 'application/json'
    },
    contentType: 'application/json',
    dataType: 'json',
    processData: false,
    xhrFields: {
        withCredentials: true
    },
    timeout: 15000
});

const TOKEN_KEY = 'el.mojang.token'

const ajax = async function (options){
    return new Promise((resolve, reject) => {
        return $.ajax({
            ...options,
            data: JSON.stringify(options.data || {}),
            complete: (xhr, status) => {
                if (status === 'error'){
                    reject(xhr)
                } else {
                    const res = xhr.response ? JSON.parse(xhr.response) : undefined
                    resolve({res, xhr})
                }
            }
        }).catch(reject)
    })
}

Object.prototype.also = function (callback) {
    callback(this)
}

const alertNode = function (res, id = 'alert') {
    return `
        <div id="${id}" class="mdui-card mdui-color-red mdui-text-color-white">
            <div class="mdui-card-primary">
                <div class="mdui-card-primary-subtitle">
                    <span class="mdui-text-color-white">${res.error}: ${res.errorMessage}</span>
                </div>
            </div>
        </div>
        `
}

const setLoading = function (e, loading){
    e.prop('disabled', loading)
    if (loading) {
        e.append('<div id="loading" class="mdui-progress-indeterminate"></div>')
    }else {
        $('.mdui-progress-indeterminate').remove('#loading')
    }
    mdui.mutation()
}

const isLoading = function (e) {
    return e.prop('disabled')
}

const homeUrl = window.location.origin.concat('/')

const changeTheme = (oldColor, color) => {
    const body =  $("body")
    const oldColorCls = `mdui-theme-primary-${oldColor}`
    const colorCls = `mdui-theme-primary-${color}`
    if (body.hasClass(oldColorCls)) {
        body.removeClass(oldColorCls)
    }
    body.addClass(colorCls)
}

const isDesktop = () => window.innerWidth > 600

const setTheme = (color) => {
    const oldColor = window.localStorage.getItem('el.theme.color') || 'indigo'
    window.localStorage.setItem('el.theme.color', color)
    changeTheme(oldColor, color)
}

const oldColor = window.localStorage.getItem('el.theme.color') || 'indigo'
changeTheme(oldColor, oldColor)


const sessionManager = {
    set token(data) {
        if (!data.accessToken || !data.clientToken){
            console.error('cannot set token with '+JSON.stringify(data)+', pattern not match')
        }
        window.sessionStorage.setItem(TOKEN_KEY, btoa(JSON.stringify(data)))
    },
    get token() {
        const data = window.sessionStorage.getItem(TOKEN_KEY)
        if (data === null || data === undefined) return undefined
        return JSON.parse(atob(data));
    },
    remove: () => window.sessionStorage.removeItem(TOKEN_KEY)
}