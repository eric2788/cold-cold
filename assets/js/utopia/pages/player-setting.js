'use strict';

console.log('player-setting.js loaded')

lockOverlay()
checkIfAdmin().then(() => {
    return getBadges().then(({res, xhr})=>{
        if (xhr.status !== 200){
            console.warn('the http request statusCode is not OK(200)')
        }

        for(const b of res){
            const id = `option-${b.badgeId}`
            const node = `
            <option value="${b.badgeId}" id="${id}">${b.badgeName}</option>
        `
            badgeList.append(node)
        }
        console.debug(badgeList)
    }).catch(handleErrorAlert).finally(() => {
        badgeList.mutation()
        unlockOverlay()
    })
})

const uuidInput = $('#player-uuid')
const searchBtn = $('#player-search')
const badgeList = $('#badge-list')

uuidInput.on('change', e => {
    const field = $('#player-uuid-field')
    if (/\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/.test(e.target.value)){
        field.removeClass('mdui-textfield-invalid')
        searchBtn.prop('disabled', false)
    }else{
        field.addClass('mdui-textfield-invalid')
        searchBtn.prop('disabled', true)
    }
    mdui.mutation()
    mdui.updateTextFields(e.target)
})

searchBtn.on('click', e => searchPlayer(uuidInput[0].value))

const infobtn = $('#info-btn')
let uuidEditing = undefined

function searchPlayer(uuid){
    resetForm()
    setLoading(searchBtn, true)
    getUser(uuid).then(({res,xhr})=>{
        if (xhr.status !== 200){
            console.warn('the http request statusCode is not OK(200)')
        }

        const username = res.account.userName
        const admin = res.account.admin
        const badges = res.badges || []
        const nickname = res.account.nickName
        const status = res.account.status

        $('#player-name')[0].value = username
        const adminSwitch = $('#admin')
        const nicknameInput = $('#nickname')
        const statusInput = $('#status')


        nicknameInput[0].value = nickname
        adminSwitch[0].checked = admin
        statusInput[0].value = status

        for(const b of badges){
           $(`#option-${b.badgeId}`).prop('selected', true)
        }

        infobtn.prop('disabled', false)

        uuidEditing = res.account.uuid

        adminSwitch.prop('disabled', false)
        badgeList.prop('disabled', false)
        nicknameInput.prop('disabled', false)
        statusInput.prop('disabled', false)

        $('#save-btn').prop('disabled', false)

        mdui.mutation()
        mdui.updateTextFields()
    }).catch(handleErrorAlert).finally(() => setLoading(searchBtn, false))
}

infobtn.on('click', () => userPage(uuidEditing))

$('#save-btn').on('click', e => {
    const nickName = $('#nickname')[0].value
    const status = $('#status')[0].value
    const admin = $('#admin')[0].checked
    const badges = []
    for(const b of mdui.$('#badge-list')[0].selectedOptions){
        badges.push(parseInt(b.value))
    }
    const data = {nickName, status, admin, badges}
    setLoading($(e.target), true)
    updateUser(data, uuidEditing).then(({res,xhr})=>{
        if (xhr.status === 204) {
            mdui.snackbar('更新成功')
        }else{
            mdui.snackbar(JSON.stringify(res))
        }
    }).catch(handleErrorAlert).finally(() => setLoading($(e.target), false))
})



function resetForm(){
    $('#player-display')[0].reset()
    infobtn.prop('disabled', true)
    $('#admin').prop('disabled', true)
    badgeList.prop('disabled', true)
}
