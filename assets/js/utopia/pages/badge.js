'use strict';

console.log('badge.js loaded')

const badgeSettings = {
    editMode: 'edit'
}

const badgeListDom = $('#badge-list')
const badgeList = new mdui.Select('#badge-list');

const badgeMap = new Map()

lockOverlay()
getBadges().then(({res, xhr})=>{
    if (xhr.status !== 200){
        console.warn('the http request statusCode is not OK(200)')
    }
    for(const b of res){
        const node = `
            <option value="${b.badgeId}">${b.badgeName}</option>
        `
        badgeListDom.append(node)
        badgeMap[b.badgeId] = b
    }
}).catch(handleErrorAlert).finally(() => {
    badgeList.handleUpdate()
    badgeListDom.mutation()
    unlockOverlay()
})

badgeListDom.on('change', (e) => {
    mdui.snackbar('selected: '+e.target.value)
    const badge = badgeMap[e.target.value]
    $('#badge-id')[0].value = badge.badgeId
    $('#badge-name')[0].value = badge.badgeName
    $('#badge-link')[0].value = badge.badgeLink
})
