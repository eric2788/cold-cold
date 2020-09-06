'use strict';

const pageMap = new WeakMap()

let currentPage = null

const addPage = (pageId, locate, options = {}) => {
    const defaultOptions = {
        loadScript: false,
        autoStopLoading: true
    }
    const option = {...defaultOptions, ...options}
    pageMap[pageId] = {locate, option}
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

async function _switchPage(id, {data, callback}) {
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
    if (!drawer.isDesktop() && drawer.isOpen()) drawer.close()
    if (pageMap[currentPage].option.loadScript) {
        await loadScript(currentPage, true)
        console.log('script loaded')
    }
    callback(res, data)
    mdui.mutation()
    return res;
}

function changePage(page, options = {}) {
    const defaultOption = {
        callback: (res, data) => {
        },
        data: {}
    }
    const option = {...defaultOption, ...options}
    const state = {page, data: option.data}
    setBarLoading(true)
    _switchPage(page, option).then(() => window.history.pushState(state, page, `${page}.html`)).catch(mdui.alert).finally(() => {
        if (isPageAutoStopLoading(page)) setBarLoading(false)
    })
}


window.onpopstate = function (event) {
    const state = event.state
    if (state?.page) {
        event.stopImmediatePropagation()
        event.preventDefault()
        setBarLoading(true)
        _switchPage(page, {
            callback: (res, data) => {
            },
            data: state.data
        }).catch(mdui.alert).finally(() => {
            if (isPageAutoStopLoading(page)) setBarLoading(false)
        })
    }
}


const unloadScript = function (page) {
    $(`script`)
        .filter((_, ele) => ele.getAttribute('id') === page)
        .each((_, ele) => {
            document.getElementsByTagName("head")[0].removeChild(ele)
        })
}

const loadScript = async function (page) {
    const url = `./assets/js/utopia/pages/${page}.js`.concat(!pageSettings.enableCaching ? `?updated=${Date.now()}` : '')

    const result = await fetch(url)
    const notExist = result.status === 404

    if (notExist) {
        console.debug(`script ${page}.js not exist, skipped`)
        return
    }
    eval(await result.text())
}
