/* eslint-disable indent */
let cancelTimer

export const setNotification = (text) => {
    return async (dispatch) => {
        dispatch({
            type: 'SET_NOTIF',
            notification: text,
        })

        if (cancelTimer) {
            clearTimeout(cancelTimer)
        }

        cancelTimer = setTimeout(
            () =>
                dispatch({
                    type: 'EMPTY_NOTIF',
                }),
            5000
        )
    }
}

const notificationReducer = (state = '', action) => {
    switch (action.type) {
        case 'SET_NOTIF':
            return action.notification
        case 'EMPTY_NOTIF':
            return ''
        default:
            return state
    }
}

export default notificationReducer
