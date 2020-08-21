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
        const node = `
              <li class="mdui-list-item">
                 User3(you): ${e.target.value}
              </li>
            `
        const chatList = $('#chat-list')
        chatList.append(node)
        const l = document.getElementById('scrollable-chat')
        l.scrollTop = l.scrollHeight
        mdui.mutation()
        e.target.value = ""
    }
})
