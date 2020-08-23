'use strict';

lockOverlay()
getUser().then(({res, xhr})=>{
    if (xhr.status !== 200) {
        console.warn('the http request statusCode is not OK(200)')
    }

    $('#username')[0].innerHTML = res.account.userName
    $('#nickname')[0].value = res.account.nickName
    $('#status')[0].value = res.account.status

    $('#check-self-btn').on('click', (e) => {
        e.preventDefault()
        console.debug(res.uuid)
        userPage(res.uuid)
    })
    $("#save-self").on('click', (e) => {
        const btn = $(e.target)
        if (isLoading(btn)) return
        setLoading(btn, true)
        const [{value: nickname}, {value: status}] = $("#update").serializeArray()
        updateUser({nickname, status}, res.uuid).then(({res, xhr})=>{
            if (xhr.status === 204){
                mdui.snackbar('update successful')
            }else{
                console.warn('response status is not 204')
                console.warn(res)
                mdui.snackbar(res || 'success with error.').open()
            }
        }).catch(handleErrorAlert).finally(() => setLoading(btn, false))
    })

}).catch(handleErrorAlert).finally(() =>{
    unlockOverlay()
    mdui.mutation()
})
