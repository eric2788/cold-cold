
const socketUrl = "wss://cloudheavenapi.iw.gy/ws";

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
        this._url = url
    }

    _lastSent = Date.now()

    get isClosed() {
        return this._socket?.readyState === WebSocket.CLOSED
    }

    async initialize() {
        if (sessionManager.token === undefined) {
            console.error('Token is null, cannot open websocket')
            return
        }
        return new Promise((res, rej) => {
            if (this._socket?.readyState === WebSocket.OPEN) {
                console.log('socket already opened, no need to initialize')
                return
            }
            this._socket = new WebSocket(this._url.concat(`?client=${sessionManager.token.clientToken}`))
            this._socket.onopen = function (event) {
                console.log("opened connection to " + socketUrl);
                res(event.data)
            };
            this._socket.onclose = function (event) {
                console.log("closed connection from " + socketUrl);
            };
            this._socket.onmessage = function (event) {
                console.debug('receive socket message: ')
                console.debug(event.data)
                const data = JSON.parse(event.data)
                switch (data.Type) {
                    case 0:
                        console.error(`Received Socket Error ${data.Data}`)
                        mdui.alert(data.Data, 'Socket Error')
                        break;
                    case 1:
                        console.debug('server online: ')
                        console.debug(data.Data)
                        socketData.online = data.Data
                        updateOnline()
                        break;
                    case 2:
                        if (currentPage !== 'chat') return
                        appendChat(data.Data)
                        break;
                }
            };
            this._socket.onerror = function (event) {
                console.warn("error: " + event.data);
                mdui.snackbar(event.data)
                rej(event.data)
            };
        })
    }

    async sendMessage(input) {
        const msg = input.split('').slice(0, 200).join('')
        if (this._socket == null) {
            throw Error("WebSocket 沒有打開連接。(連接失敗?)")
        }
        if (currentPage !== 'chat') {
            console.warn('not in chat page, cannot send message')
            return false
        }
        if (this.isClosed) {
            console.debug('socket closed unexpectedly, restarting...')
            await this.initialize()
        }
        const date = Date.now()
        if (date - this._lastSent < 1000) {
            throw Error("輸入速度頻繁，請等一秒後再試。")
        }
        const data = {
            type: 'BrowserMessage',
            data: {
                clientToken: sessionManager.token.clientToken,
                message: msg
            }
        }
        this._socket.send(JSON.stringify(data))
        this._lastSent = date
        return true
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
webSocket.initialize().catch(console.error)

setInterval(() => {
    if (webSocket.isClosed){
        console.debug('socket closed unexpectedly, restarting...')
        webSocket.initialize().catch(console.error)
    }
}, 1000 * 60)

function appendChat(chat){
    if (currentPage !== 'chat'){
        console.warn('not in chat page')
        return
    }
    const node = `
              <li class="mdui-list-item">
                 ${chat}
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

