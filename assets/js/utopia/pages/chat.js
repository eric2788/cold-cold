'use strict';

console.log('chat.js loaded')

const input = $("#chat-input")
input.off('keydown')
input.on('keydown', e => {
    if (e.key === 'Enter'){
        if (!e.target.value){
            console.debug('empty string, skipped')
            return
        }
        webSocket.sendMessage(e.target.value)
        e.target.value = ""
    }
})
