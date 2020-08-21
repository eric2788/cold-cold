'use strict';

if (window.sessionStorage.getItem('el.mojang.token') === null) {
    document.location.href = homeUrl.concat('login.html')
}

addPage('news', './assets/pages/news.html')
addPage('about', './assets/pages/about.html')
addPage('rule', './assets/pages/rules.html')
addPage('intro', './assets/pages/intro.html')
addPage('chat', './assets/pages/chat.html', true)
addPage('player-list', './assets/pages/player-list.html', true)
addPage('account', './assets/pages/account.html', true)

changePage('news').catch(console.error)

const drawer = new mdui.Drawer('#drawer', {swipe: true})

$('#toggle-drawer').on('click', () => drawer.toggle())

$("#nav").children('a').each((_, ele) => {
    const id = ele.getAttribute('id')
    if (id === undefined) {
        console.debug('no id within element, won\'t change pages');
        return
    }
    ele.addEventListener('click', () => changePage(id).catch(console.error))
})

$("#change-color").children('button').each((_, ele) => {
    const color = ele.getAttribute('id')
    if (color === undefined) {
        console.debug('no id within element, won\'t change theme');
        return
    }
    ele.addEventListener('click', () => setTheme(color))
})

