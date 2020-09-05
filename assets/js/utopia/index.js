'use strict';

const cache = {
    uuid: undefined,
    badge: undefined,
    username: undefined
}

async function checkIfAdmin(){
    if (!sessionManager.token) {
        window.location.href = homeUrl.concat('login.html')
    }
    await validate(sessionManager.token).then(({res,xhr})=>{
        if (xhr.status !== 200){
            window.location.href = homeUrl.concat('login.html')
            return
        }
        sessionManager.token = res.token
        if (window.location.href === homeUrl.concat('utopia.html')) return
        if (!res.user.admin){
            alert('you are not admin!')
            window.location.href = homeUrl.concat('utopia.html')
        }
    }).catch(err => {
        console.error(err)
        window.location.href = homeUrl.concat('login.html')
    })
}

if (sessionManager.token === undefined) {
    document.location.href = homeUrl.concat('login.html')
} else {
    validate(sessionManager.token).then(({res, xhr})=>{
        if (xhr.status === 200) {
            sessionManager.token = res.token

            $('#welcome-text').innerText = `歡迎, ${res.user.userName}`

            if (res.user.admin) {
                console.debug('user is admin')
                const node = `
                    <a class="mdui-list-item mdui-ripple" id="badge">
                        <i class="mdui-list-item-icon mdui-icon material-icons">local_florist</i>
                        <div class="mdui-list-item-content">徽章設定</div>
                     </a>
                     <a class="mdui-list-item mdui-ripple" id="player-setting">
                        <i class="mdui-list-item-icon mdui-icon material-icons">person</i>
                        <div class="mdui-list-item-content">玩家設置</div>
                     </a>
                `
                $("#admin-section").replaceWith(node)
            }

            $("#nav").children('a').each((_, ele) => {
                const id = ele.getAttribute('id')
                if (id === null) {
                    console.debug('no id within element, won\'t change pages');
                    return
                }
                if (ele.classList.contains('not-page')){
                    console.debug(id+' has not-page, skipped');
                    return
                }
                ele.addEventListener('click', () => changePage(id).catch(console.error))
            })

            updateServerCount()

            return changePage('news')
        }else{
            alert(res)
            alert(xhr)
            console.warn(res)
            console.warn(xhr)
        }
    }).catch(err => {
        if (err.response) {
            console.warn(err.response)
        } else {
            console.error(err)
            mdui.snackbar(err)
        }
        document.location.href = homeUrl.concat('login.html')
    }).finally(mdui.mutation)
}

addPage('news', './assets/pages/news.html', true)
addPage('about', './assets/pages/about.html')
addPage('rule', './assets/pages/rules.html')
addPage('intro', './assets/pages/intro.html')
addPage('chat', './assets/pages/chat.html', true)
addPage('player-list', './assets/pages/player-list.html', true)
addPage('account', './assets/pages/account.html', true)
addPage('player', './assets/pages/player.html', true)
addPage('badge', './assets/pages/badge.html', true)
addPage('player-setting', './assets/pages/player-setting.html', true)

function userPage(uuid) {
    cache.uuid = uuid
    changePage('player')
        .then(() => cache.uuid = undefined)
        .catch(err => mdui.snackbar(err).open())
}

const drawer = new mdui.Drawer('#drawer', {swipe: true})

$('#toggle-drawer').on('click', () => drawer.toggle())

$("#change-color").children('button').each((_, ele) => {
    const color = ele.getAttribute('id')
    if (color === undefined) {
        console.debug('no id within element, won\'t change theme');
        return
    }
    ele.addEventListener('click', () => setTheme(color))
})

function handleErrorAlert(err) {
    if (err.response){
        console.warn(err.response)
        const res = JSON.parse(err.response)
        let data
        if (res.error){
            if (res.errorMessage === 'Invalid token'){
                unlockOverlay()
                mdui.dialog({
                    title: '無效的 session Token',
                    content: '你需要重新登入以確保順利存取資料。',
                    buttons: [
                        {
                            text: '登出',
                            onClick: () => {
                                signOut(sessionManager.token).catch(console.error)
                            }
                        },
                        {
                            text: '取消'
                        }
                    ]
                })
            }
            data = res
        }else{
            data = {
                error: res.title,
                errorMessage: JSON.stringify(res.errors)
            }
        }
        if (drawer.isDesktop()){
            const node = alertNode(data)
            $('#alert').replaceWith(node)
        }else{
            mdui.alert(data.errorMessage, data.error)
        }
    }else{
        console.warn(err)
        mdui.snackbar(err?.message || 'ERROR').open()
    }
}

$("#logout-Btn").one('click', (_) => {
    const token = sessionManager.token
    if (token === undefined){
        console.warn('unknown token, back to login')
        window.location.href = homeUrl.concat('/login.html')
        return
    }
    const logoutBtn = $("#logout-btn")
    if (isLoading(logoutBtn)){
        return;
    }
    lockOverlay()
    signOut(token).then(({_, xhr}) => {
        console.debug(`status response: ${xhr.status}`)
        console.debug('logout successful')
    }).catch(xhr => {
        console.error(xhr)
    }).finally(() => {
        unlockOverlay()
        sessionManager.remove()
        window.location.href = homeUrl.concat('/login.html')
    })
})

function lockOverlay(){
    $.showOverlay(3000000)
    $('body').css({
        'pointer-events': 'none'
    })
    mdui.mutation()

}

function unlockOverlay(){
    $.hideOverlay(true)
    $('body').css({
        'pointer-events': 'auto'
    })
    if (!drawer.isDesktop() && drawer.isOpen()) drawer.close()
    mdui.mutation()
}

