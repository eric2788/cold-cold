'use strict';

const pageMap = new WeakMap()
const changeOption = new Map()

let currentPage = null

const addPage = (pageId, locate, options = {}) => {
    const defaultOptions = {
        loadScript: false,
        autoStopLoading: true
    }
    const option = {...defaultOptions, ...options}
    pageMap[pageId] = {locate, option}
}

const onPageChange = (pageId, func) => {
    changeOption.set(pageId, func)
}

const removePage = (pageId) => {
    pageMap.delete(pageId)
}

const renderPage = async (pageId) => {
    const page = pageMap[pageId]
    if (!page) {
        console.warn("render failed, cannot find pageId " + pageId)
        throw Error("cannot find pageId " + pageId)
    }
    const locate = page.locate.concat(!pageSettings.enableCaching ? `?updated=${Date.now()}` : '')
    console.debug('rendering pages ' + locate)
    return await fetch(locate).then(res => res.text())
}

function isPageAutoStopLoading(page) {
    return pageMap[page].option.autoStopLoading
}

async function changePage(id, data = {}) {
    const heaven = $("#heaven")
    const res = await renderPage(id, true)
    console.debug('changing pages ' + id)
    let pageItem = $(`.mdui-list`)
    if (currentPage) {
        pageItem.find(`#${currentPage}`).removeClass('mdui-list-item-active')
        console.debug(`removed ${currentPage} as active`)
    }
    currentPage = id
    pageItem.find(`#${currentPage}`).addClass('mdui-list-item-active')
    console.debug(`added ${currentPage} as active`)
    heaven.replaceWith(res)
    window.history.pushState(res, id, `${currentPage}.html`)
    if (!drawer.isDesktop() && drawer.isOpen()) drawer.close()
    if (pageMap[currentPage].option.loadScript) {
        await loadScript(currentPage, true)
        console.log('script loaded')
    }
    if (changeOption.has(id)) {
        console.debug('pageChange action executed for ' + id)
        const func = changeOption.get(id)
        func(res, data)
    }
    mdui.mutation()
    return res;
}

const unloadScript = function (page) {
    $(`script`)
        .filter((_, ele) => ele.getAttribute('id') === page)
        .each((_, ele) => {
            document.getElementsByTagName("head")[0].removeChild(ele)
        })
}

const loadScript = async function (page){
    const url = `./assets/js/utopia/pages/${page}.js`.concat(!pageSettings.enableCaching ? `?updated=${Date.now()}` : '')

    const result = await fetch(url)
    const notExist = result.status === 404

    if (notExist){
        console.debug(`script ${page}.js not exist, skipped`)
        return
    }
    eval(await result.text())
}
