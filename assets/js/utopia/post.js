'use strict';

const url = new URL(window.location.href);
let id = url.searchParams.get('id');
if (id == null) id = '404';
console.log(id);
init(id);

function init(id){
    fetch(homeUrl.concat(`/posts/${id}.html`)).then(r => r.text()).then(r => {
        const parser = new DOMParser();
        return parser.parseFromString(r, "text/html");
    }).then(doc => {
        let node = doc.getElementsByTagName('title');
        $('#title').replaceWith(node[0].innerHTML)
        node = doc.getElementsByTagName('sub-title');
        $('#subtitle').replaceWith(node[0].innerHTML)
        node[0].innerHTML = '';
        $('#content').replaceWith(doc.documentElement.innerHTML)
    }).catch(err=>{
        console.error(err);
        mdui.snackbar(err).open()
        init('404');
    })
}
