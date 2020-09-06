'use strict';

console.log('player-list.js loaded')

getUsers().then(({res, xhr}) => {
    const playerCardList = $('#player-card-list')
    if (xhr.status !== 200) {
        console.warn('the http request statusCode is not OK(200)')
    }
    for (const user of res) {
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
}).catch(handleErrorAlert).finally(() => setBarLoading(false))
