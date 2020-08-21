'use strict';

console.log('player-list.js loaded')


const playerCardList = $('#player-card-list')

const players = [
    {
        uuid: 'c9e71c81-a71a-496e-8f3a-a61bdf2bbc3c',
        name: 'RUNARUNAWAY'
    },{
        uuid: 'fc242759-551e-4cca-b833-dfdac6bc1720',
        name: 'PremiumBeefJerky'
    },{
        uuid: '8aa43f39-3df4-4d10-a1ad-40196d918fb0',
        name: '1pv'
    },{
        uuid: 'f3de0d55-60cf-4234-96d4-d99e7c5da0f5',
        name: 'CjLovesPie22'
    }
]

players.forEach((player) => {
    const insert = `<div class="mdui-col">
            <div class="mdui-card">
                <div class="mdui-card-header">
                    <img alt="avatar" class="mdui-card-header-avatar" src="https://minotar.net/avatar/${player.uuid}/100">
                    <div class="mdui-card-header-title">${player.name}</div>
                    <div class="mdui-card-header-subtitle">Offline</div>
                </div>
                <div class="mdui-card-content">
                    TEST
                </div>
            </div>
        </div>`
    playerCardList.append(insert)
})
