'use strict';

console.log('chat.js loaded')

const input = $("#chat-input")

input.off('keydown')
input.on('keydown', e => {
    if (e.key === 'Enter'){
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
        })

    }
})
