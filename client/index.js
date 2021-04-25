import React from 'react'
import ReactDOM from 'react-dom'
//import { BrowserRouter } from 'react-router-dom'
//import ErrorBoundary from './src/ErrorBoundary'

import { Provider } from 'react-redux'
import store from './src/store'

import App from './src/App'

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
)
