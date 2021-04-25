import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
//import ErrorBoundary from './src/ErrorBoundary'

import { Provider } from 'react-redux'
import store from './src/store'

import App from './src/App'
import './index.css'

const refresh = () =>
    render(
        <BrowserRouter>
            <Provider store={store}>
                <App />
            </Provider>
        </BrowserRouter>,
        document.getElementById('root')
    )

refresh()

if (module.hot) {
    module.hot.accept()
}
