'use strict';

if (sessionManager.token !== undefined) {
    validate(sessionManager.token).then(({res, xhr})=>{
        if (xhr.status === 200){
            sessionManager.token = res.token
            jumpTo('utopia')
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
        jumpTo('utopia')
    }).catch(err => {
        if (err.response){
            console.warn(err.response)
            const res = JSON.parse(err.response)
            if (isDesktop()){
                $('#alert').replaceWith(alertNode(res))
            }else{
                mdui.alert(res.errorMessage, res.error)
            }
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

function openTerms(){
    fetch('./settings/terms.json'.concat(!pageSettings.enableCaching ? `?updated=${Date.now()}` : '')).then(r => r.json()).then(json => {
        const line = json.termsLogin.map(s => `<p>${s}</p>`).join('\n')
        mdui.dialog({
            title: '登入此網站則代表你同意以下條款',
            content: `
            <div style="overflow-y: scroll; max-height: 500px">
                `+line+`
            </div>
        `
        })
    }).catch(err => {
        mdui.dialog({
            title: '登入此網站則代表你同意以下條款',
            content: `<span>加載失敗: ${err?.message || JSON.stringify(err)}, 請重新再試</span>`
        })
    })

}

