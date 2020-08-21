'use strict';

console.log('index.js loaded')

const $ = mdui.$;

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

const homeUrl = window.location.origin.concat('/cold-cold/')

const changeTheme = (oldColor, color) => {
   const body =  $("body")
    const oldColorCls = `mdui-theme-primary-${oldColor}`
    const colorCls = `mdui-theme-primary-${color}`
    if (body.hasClass(oldColorCls)) {
        body.removeClass(oldColorCls)
    }
    body.addClass(colorCls)
}

const setTheme = (color) => {
    const oldColor = window.localStorage.getItem('el.theme.color') || 'indigo'
    window.localStorage.setItem('el.theme.color', color)
    changeTheme(oldColor, color)
}

const oldColor = window.localStorage.getItem('el.theme.color') || 'indigo'
changeTheme(oldColor, oldColor)
