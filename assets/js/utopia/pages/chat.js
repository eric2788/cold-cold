'use strict';

console.log('chat.js loaded')

const input = $("#chat-input")

lockOverlay()
validate(sessionManager.token).then(({res, xhr}) => {
    if (xhr.status === 200) {
        sessionManager.token = res.token
        $('#chat-header')[0].innerText = `以 ${res.user.userName} 的身份聊天。`
    } else {
        console.warn(res.response)
    }
}).catch(console.error).finally(() => {
    mdui.mutation()
    unlockOverlay()
})

input.off('keydown')
input.on('keydown', e => {
    if (e.key === 'Enter') {
        if (!e.target.value) {
            console.debug('empty string, skipped')
            return
        }
        const field = $('#chat-field')
        const error = $('#chat-error')

        setInputLoading(field, input, true)
        webSocket.sendMessage(e.target.value).then(res => {
            if (res) e.target.value = ""
            field.removeClass('mdui-textfield-invalid')
        }).catch(err => {
            console.warn(err)
            if (!field.hasClass('mdui-textfield-invalid')) {
                field.addClass('mdui-textfield-invalid')
            }
            error[0].innerHTML = err
        }).finally(() => {
            setInputLoading(field, input, false)
            mdui.mutation()
        })

    }
})

function setInputLoading(field, input, loading) {
    const node = `
        <div class="mdui-progress">
            <div class="mdui-progress-indeterminate"></div>
        </div>
    `
    if (loading) {
        input.prop('disabled', true)
        field.append(node)
    } else {
        input.prop('disabled', false)
        field.remove('.mdui-progress')
    }
    field.mutation()
    input.mutation()
}
