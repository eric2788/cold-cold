'use strict';

console.log('badge.js loaded')

lockOverlay()
checkIfAdmin().then(() => reloadPage())

const badgeSettings = {
    editMode: 'edit'
}

const badgeListDom = $('#badge-list')
const badgeList = new mdui.Select(badgeListDom);
const badgeName = $('#badge-name')
const saveBtn = $('#save-btn')
const imgReview = $('#img-review')
const deleteBtn = $('#delete-btn')

const badgeMap = new Map()

function reloadPage(){
    resetForm()
    getBadges().then(({res, xhr})=>{
        if (xhr.status !== 200){
            console.warn('the http request statusCode is not OK(200)')
        }
        badgeListDom.children()?.each((_, ele) => ele.remove())
        for(const b of res){
            const node = `
            <option value="${b.badgeId}">${b.badgeName}</option>
        `
            badgeListDom.append(node)
            badgeMap[b.badgeId] = b
        }
        console.debug(badgeList)
    }).catch(handleErrorAlert).finally(() => {
        badgeList.handleUpdate()
        badgeListDom.mutation()
        unlockOverlay()
    })
}



const modeBtn = $('#switch-mode')

function switchMode(edit){
    badgeSettings.editMode = edit ? 'edit' : 'create'
    const mode = edit ? '新增' : '修改'
    modeBtn[0].innerHTML = `${mode}徽章`
    if (badgeSettings.editMode === 'create') {
        resetForm()
        badgeList.$element.css('visibility', 'hidden')
        badgeName.prop('disabled', false)
        badgeLink.prop('disabled', false)
        saveBtn.prop('disabled', false)
        deleteBtn.prop('disabled', true)
    }else{
        badgeList.$element.css('visibility', 'visible')
        fillForm(badgeList.selectedValue)
    }
    mdui.mutation()
    mdui.updateTextFields()
}

function resetForm(){
    $('#badge-form')[0].reset()
    imgReview[0].src = ""
    mdui.mutation()
}

const badgeLink = $('#badge-link')

function fillForm(badgeId){
    const badge = badgeMap[badgeId]
    let disabled = false
    if (!badge){
        disabled = true
    }else{
        $('#badge-id')[0].value = badge.badgeId
        badgeName[0].value = badge.badgeName
        badgeLink[0].value = badge.badgeLink
        updateImg(badge.badgeLink)
    }
    badgeName.prop('disabled', disabled)
    badgeLink.prop('disabled', disabled)
    saveBtn.prop('disabled', disabled)
    deleteBtn.prop('disabled', disabled)
    mdui.mutation()
    mdui.updateTextFields()
}

badgeListDom.on('change', (e) => {
    fillForm(e.target.value)
    switchMode(true)
})

modeBtn.on('click', () => switchMode(badgeSettings.editMode !== 'edit'))

badgeLink.on('change', e => {
    updateImg(e.target.value)
})

imgReview.on('load', e => {
    const field = $('#badge-link-field')
    field.removeClass('mdui-textfield-invalid')
    mdui.updateTextFields(e.target)
    field.mutation()
})



imgReview.on('error', e => {
    if (badgeLink.prop('disabled')) return
    const field = $('#badge-link-field')
    field.addClass('mdui-textfield-invalid')
    mdui.updateTextFields(e.target)
    field.mutation()
})

badgeName.on('change', e => {
    const field = $('#badge-name-field')
    if (validateName(e.target.value)){
        field.removeClass('mdui-textfield-invalid')
    }else{
        field.addClass('mdui-textfield-invalid')
    }
    field.mutation()
    mdui.updateTextFields(e.target)
})

function validateName(value) {
    return value && !/.*[!@#$%^&*()_+'"].*/.test(value)
}

function validateInput(id){
    const invalid = $(`#${id}-field`).hasClass('mdui-textfield-invalid')
    const miss = $(`#${id}`)[0].validity.valueMissing
    return !invalid && !miss
}

function updateImg(src){
    const img = imgReview
    img[0].src = src
    img.mutation()
}


deleteBtn.on('click', () => {
    const id = $('#badge-id')[0].value
    if (badgeSettings.editMode !== 'edit'){
        mdui.snackbar('ERROR: not in edit mode')
        return
    }
    if (!id){
        mdui.snackbar('無效的 badgeId')
        return
    }
    setLoading(deleteBtn, true)
    deleteBadge(id).then(handleSuccess).catch(handleErrorAlert).finally(() => setLoading(deleteBtn, false))
})

saveBtn.on('click', () => {
    if (!validateInput('badge-name')){
        mdui.snackbar('無效名稱')
        return
    }
    if (!validateInput('badge-link')){
        mdui.snackbar('無效圖片')
        return
    }
    const id = $('#badge-id')[0].value
    const [{value: name}, {value: link}] = $('#badge-form').serializeArray()
    let promise
    if (badgeSettings.editMode === 'edit'){
        if (!id){
            mdui.snackbar('無效的 badgeId')
            return
        }
        setLoading(saveBtn, true)
        promise = updateBadge(id, {
            badgeId: id,
            badgeName: name,
            badgeLink: link
        })
    }else{
        setLoading(saveBtn, true)
        promise = createBadge({
            badgeName: name,
            badgeLink: link
        })
    }
    promise.then(handleSuccess).catch(handleErrorAlert).finally(() => setLoading(saveBtn, false))
})

function handleSuccess({res, xhr}){
    if (xhr.status === 204){
        mdui.snackbar('更新成功')
    }else{
        mdui.snackbar(JSON.stringify(res))
    }
    reloadPage()
}

