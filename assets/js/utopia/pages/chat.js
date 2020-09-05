'use strict';

console.log('chat.js loaded')

const input = $("#chat-input")

validate(sessionManager.token).then(({res, xhr}) => {
    if (xhr.status === 200) {
        $('#chat-header')[0].value = `以 ${res.user.userName} 的身份聊天。`
        input.prop('disabled', false)
    } else {
        console.warn(res.response)
    }
}).catch(console.error).finally(mdui.mutation)

input.off('keydown')
input.on('keydown', e => {
    if (e.key === 'Enter') {
        if (!e.target.value) {
            console.debug('empty string, skipped')
            return
        }
        const field = $('#chat-field')
        const error = $('#chat-error')
        webSocket.sendMessage(e.target.value).then(res => {
            if (res) e.target.value = ""
            field.removeClass('mdui-textfield-invalid')
        }).catch(err => {
            console.warn(err)
            if (!field.hasClass('mdui-textfield-invalid')) {
                field.addClass('mdui-textfield-invalid')
            }
            error[0].innerHTML = err
        }).finally(mdui.mutation)

    }
})
