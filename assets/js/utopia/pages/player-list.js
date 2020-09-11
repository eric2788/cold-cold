'use strict';

console.log('player-list.js loaded')

const playerCardList = $('#player-card-list')
const btn = $('#users-load-btn')

let page = 1

function getCurrentTotal(){
    return playerCardList.length
}

function getMore(){
    getUsers(page).then(({res, xhr}) => {

        if (xhr.status !== 200) {
            console.warn('the http request statusCode is not OK(200)')
        }

        appendList(res.list)
        page++
        if (getCurrentTotal() <= res.total){
            btn.css('display', 'none')
        }else{
            btn.css('display', 'block')
        }

    }).catch(handleErrorAlert).finally(() => setBarLoading(false))
}

getMore()

btn.on('click', getMore)

function appendList(list) {
    for (const user of list) {
        const online = socketData.online.includes(user.uuid)
        const insert = `<div class="mdui-col mdui-m-b-2">
            <div class="mdui-card mdui-ripple" id="card-${user.uuid}">
                <div class="mdui-card-header">
                    <img alt="avatar" class="mdui-card-header-avatar" src="https://minotar.net/avatar/${user.uuid}/100">
                    <div class="mdui-card-header-title">${user.userName}</div>
                    <div class="mdui-card-header-subtitle" id="online" uuid="${user.uuid}">${getStatusNode(online)}</div>
                </div>
                <div class="mdui-card-content">
                    ${user.admin ? '<p>此玩家是管理員</p>' : ''}
                    <p>暱稱: ${user.nickName || '無'}</p>
                </div>
            </div>
        </div>`
        playerCardList.append(insert)
        $(`#card-${user.uuid}`).on('click', () => userPage(user.uuid))
    }
}
