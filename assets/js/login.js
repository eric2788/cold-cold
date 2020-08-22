'use strict';

if (sessionManager.token !== undefined) {
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
    login(username, pw).then( ({res, _}) => {
        const {userName, nickName, admin} = res.user
        sessionManager.token = res.token
        alert(`welcome ${userName}(${nickName}), admin: ${admin}`)
        document.location.href = homeUrl.concat('utopia.html')
    }).catch(err => {
        if (err.response){
            console.warn(err.response)
            const res = JSON.parse(err.response)
            $('#alert').replaceWith(' <div id="alert" class="mdui-card mdui-color-red-200 mdui-text-color-white">\n' +
                '                            <div class="mdui-card-content">\n' +
                '                                \n' + res.errorMessage +
                '                            </div>\n' +
                '                        </div>')
        }else{
            console.warn(err)
        }
    }).finally(() => {
        setLoading(btn, false)
    })
}

btn.on('click', submit);
$("#password-input").on('keydown', submit)

