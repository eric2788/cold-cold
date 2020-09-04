'use strict';

console.log('news.js loaded')

const perLoadCount = 10
fetch('./settings/news.json').then(r=>r.json()).then(json => {
    let times = 0

    const btn = $('#news-load-btn')
    function loadMore() {
        const news = json.slice(perLoadCount * times, perLoadCount)
        appendList(news)
        times++
        if (json.length <= perLoadCount * times) {
            btn.remove()
        }
        mdui.mutation()
    }

    loadMore()
    const progress = $('.mdui-progress')
    progress.remove()
    progress.mutation()

    btn.on('click', loadMore)
}).catch(handleErrorAlert)


function appendList(news) {
    const list = $('#news-list')
    for (const {id, icon, title, created} of news) {
        const node = `
        <div class="mdui-card mdui-m-a-3 mdui-ripple mdui-hoverable">
        <div class="mdui-card-header mdui-color-theme-900" onclick="window.location.href = 'post.html?id=${id}'">
            <img class="mdui-card-header-avatar" src="${icon}" alt="icon">
            <div class="mdui-card-header-title">${title}</div> <!--標題-->
            <div class="mdui-card-header-subtitle">日期: ${created}</div> <!--副標題-->
        </div>
        </div>
        `
        list.append(node)
    }
}
