'use strict';

console.log('player.js loaded')

lockOverlay()
getUser(cache.uuid || undefined).then(({res, xhr})=>{
    if (xhr.status !== 200) {
        console.warn('the http request statusCode is not OK(200)')
    }
    $('#body-img')[0].src = `https://minotar.net/armor/body/${res.account.uuid}`
    $('#username')[0].value = res.account.userName
    $('#nickname')[0].value = res.account.nickName
    const online = $('#online')[0]
    online.value = getStatusNode(socketData.online.includes(res.account.uuid))
    online.uuid = res.account.uuid
    $('#status')[0].value = res.account.status
    $('#join-time')[0].value = res.account.joinTime
    $('#admin')[0].value = res.account.admin

    console.log(res.badges)
    for(const badge of res.badges){
        const insert = `
            <li class="mdui-list-item">
                      <div class="mdui-list-item-avatar">
                         <img alt="avatar" src="${badge.badgeLink}">
                      </div>
                  <div class="mdui-list-item-content">${badge.badgeName}</div>
            </li>
        `
        $("#badges").append(insert)
    }
}).catch(handleErrorAlert).finally(() =>{
    unlockOverlay()
    mdui.mutation()
})





