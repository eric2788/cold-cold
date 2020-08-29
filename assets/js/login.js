'use strict';

if (sessionManager.token !== undefined) {
    validate(sessionManager.token).then(({res, xhr})=>{
        if (xhr.status === 200){
            document.location.href = homeUrl.concat('utopia.html')
        }else{
            console.warn(res)
            console.warn(xhr)
        }
    }).catch(err =>{
        if (err.response){
            console.warn(err.response)
        }else{
            console.error(err)
            mdui.snackbar(err).open()
        }
    })
}

const loginBtn = $('#loginBtn')

function submit(e) {
    if (e instanceof KeyboardEvent){
        if (e.key !== 'Enter') return;
    }
    if (isLoading(loginBtn)) return
    const [{value: username}, {value: pw}] = $('#login').serializeArray();
    if (!username || !pw) {
        console.log('login failed because of empty string')
        return
    }
    setLoading(loginBtn, true)
    login(username, pw).then( ({res, xhr}) => {
        if (xhr.status !== 200){
            return
        }
        sessionManager.token = res
        document.location.href = homeUrl.concat('utopia.html')
    }).catch(err => {
        if (err.response){
            console.warn(err.response)
            const res = JSON.parse(err.response)
            $('#alert').replaceWith(alertNode(res))
        }else{
            console.warn(err)
            mdui.snackbar('<span class="mdui-text-color-red">與伺服器失去連線</span>')
        }
    }).finally(() => {
        setLoading(loginBtn, false)
    })
}

loginBtn.on('click', submit);
$("#password-input").on('keydown', submit)

