'use strict';

const authApi = api.concat('/auth/')
const userApi = api.concat('/user/')
const resourceApi = api.concat('/resource/')

const login = async (user, password) => {
    console.log('logging in')
    return await ajax({
        url: authApi.concat('authenticate'),
        data: {username: user, password}
    })
};

const signOut = async (token) => {
    console.log('signing out')
    return await ajax({
        url: authApi.concat('signout'),
        data: token
    })
}

const validate = async (token) => {
    return await ajax({
        url: authApi.concat('validate'),
        data: token
    })
}

const getUsers = async () => {
    return await ajax({
        url: userApi.concat('users'),
        data: sessionManager.token
    })
}

const getUser = async (uuid = undefined) => {
    return await ajax({
        url: uuid !== undefined ? userApi.concat(uuid) : userApi,
        data: sessionManager.token
    })
}

const updateUser = async (update, uuid = undefined) => {
    return await ajax({
        method: 'PUT',
        url: uuid !== undefined ? userApi.concat(uuid) : userApi,
        data: {
            request: sessionManager.token,
            editor: update
        }
    })
}

const getBadges = async () => {
    return await ajax({
        url: resourceApi.concat('badges'),
        data: sessionManager.token
    })
}

const getBadge = async (id) => {
    return await ajax({
        url: resourceApi.concat(`badge/${id}`),
        data: sessionManager.token
    })
}

const createBadge = async (badge) => {
    return await ajax({
        url: resourceApi.concat(`badge`),
        data: {
            request: sessionManager.token,
            badge: badge
        }
    })
}

const updateBadge = async (id, badge) =>{
    return await ajax({
        method: 'PUT',
        url: resourceApi.concat(`badge/${id}`),
        data: {
            request: sessionManager.token,
            badge: badge
        }
    })
}

const deleteBadge = async (id) => {
    return await ajax({
        method: 'DELETE',
        url: resourceApi.concat(`badge/${id}`),
        data: sessionManager.token
    })
}
