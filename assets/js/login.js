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
        sessionManager.token = res
        document.location.href = homeUrl.concat('utopia.html')
    }).catch(err => {
        if (err.response){
            console.warn(err.response)
            const res = JSON.parse(err.response)
            $('#alert').replaceWith(alertNode(res))
        }else{
            console.warn(err)
            mdui.snackbar(err || 'ERROR').open()
        }
    }).finally(() => {
        setLoading(btn, false)
    })
}

btn.on('click', submit);
$("#password-input").on('keydown', submit)

