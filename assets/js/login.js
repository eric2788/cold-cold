'use strict';

if (window.sessionStorage.getItem('el.mojang.token') !== null) {
    document.location.href = homeUrl.concat('utopia.html')
}

const btn = $('#loginBtn')

function submit(e) {
    if (e instanceof KeyboardEvent){
        if (e.key !== 'Enter') return;
    }
    if (isLoading(btn)) return
    const [{value: username}, {value: pw}] = $('#login').serializeArray();
    if (!username || !pw) {
        console.log('login failed because of empty string')
        return
    }
    setLoading(btn, true)
    login(username, pw).then( res => {
        document.location.href = homeUrl.concat('utopia.html')
    }).catch(err => {
        console.warn(err)
        $('#alert').replaceWith(' <div id="alert" class="mdui-card mdui-color-red-200 mdui-text-color-white">\n' +
            '                            <div class="mdui-card-content">\n' +
            '                                \n' + err +
            '                            </div>\n' +
            '                        </div>')
    }).finally(() => {
        setLoading(btn, false)
    })
}

btn.on('click', submit);
$("#password-input").on('keydown', submit)

