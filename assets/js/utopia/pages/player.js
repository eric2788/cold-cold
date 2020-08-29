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
    $('#last-login')[0].value = new Date(res.cmi.lastLoginTime).toISOString()
    $('#play-time')[0].value = `${new Date(res.cmi.totalPlayTime).getHours()}小時`
    $('#join-time')[0].value = new Date(res.account.joinTime).toISOString().slice(0,10)
    $('#admin')[0].checked = res.account.admin

    console.debug(res.badges)
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
    mdui.updateTextFields()
}).catch(handleErrorAlert).finally(() =>{
    unlockOverlay()
    mdui.mutation()
})





