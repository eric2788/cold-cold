
const socketUrl = "ws://localhost:5000/ws";

const socketData = {
    online: [],
    get count() {
        return this.online.length
    }
}

function getStatusNode(online) {
    return online ? '<span class="mdui-text-color-green">上線</span>' : '<span class="mdui-text-color-red">下線</span>'
}

class HeavenSocket {
    constructor(url) {
        if (sessionManager.token === undefined){
            console.error('Token is null, cannot open websocket')
            return
        }
        this._socket = new WebSocket(url.concat(`?client=${sessionManager.token.clientToken}`))
        this._socket.onopen = function(event) {
            console.log("opened connection to " + socketUrl);
        };
        this._socket.onclose = function(event) {
            console.log("closed connection from " + socketUrl);
        };
        this._socket.onmessage = function(event) {
            console.log('receive socket message: ')
            console.log(event.data)
            const data = JSON.parse(event.data)
            switch (data.Type){
                case 0:
                    console.log('server online: ')
                    console.log(data.Data)
                    socketData.online = data.Data
                    updateOnline()
                    break;
                case 1:
                    if (currentPage !== 'chat') return
                    appendChat(data.Data.Identity, data.Data.Message, data.Data.FromMC)
                    break;
            }
        };
        this._socket.onerror = function(event) {
            console.log("error: " + event.data);
        };
    }

    sendMessage(msg) {
        if (this._socket == null){
            console.error('web socket didn\'t opened')
            return
        }
        if (currentPage !== 'chat'){
            console.warn('not in chat page, cannot send message')
        }
        const data = {
            type: 'Message',
            data: {
                clientToken: sessionManager.token.clientToken,
                message: msg
            }
        }
        this._socket.send(JSON.stringify(data))
    }

    close() {
        if (this._socket == null){
            console.error('web socket didn\'t opened')
            return
        }
        this._socket.close(1000, 'Client closed')
    }
}

const webSocket = new HeavenSocket(socketUrl)

function appendChat(identity, message, fromMC){
    if (currentPage !== 'chat'){
        console.warn('not in chat page')
        return
    }
    const chatFormat = fromMC || !identity.NickName ? `${identity.UserName}: ${message}` : `${identity.UserName}(${identity.NickName}): ${message}`
    const node = `
              <li class="mdui-list-item">
                 ${chatFormat}
              </li>
            `
    const chatList = $('#chat-list')
    chatList.append(node)
    const l = document.getElementById('scrollable-chat')
    l.scrollTop = l.scrollHeight
    mdui.mutation()
}

function updateOnline(){
    $('#online').each((_, ele) => {
        const uuid = ele.getAttribute('uuid')
        if (uuid === null || uuid === undefined) {
            console.warn(ele)
            console.warn('does not have uuid attribute, skipped')
            return
        }
        ele.value = getStatusNode(socketData.online.includes(uuid))
    })
}

function updateServerCount(){
    $('#server-count')[0].innerHTML = `伺服器人數: ${socketData.count}`
}

