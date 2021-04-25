import React, { useState } from 'react'
import { connect } from 'react-redux'
import userListService from '../services/userList'
import { setNotification } from '../reducers/notificationReducer'
import Style from './GenericStyles'
import { Redirect } from 'react-router'

const RegisterForm = (props) => {
    if (props.user) {
        return <Redirect to="/" />
    }

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await userListService.create({
                username,
                password,
                name,
            })
            setUsername('')
            setPassword('')
            setName('')
            props.setNotification('User created. You can now login.')
        } catch (e) {
            if (e.response.data.message) {
                props.setNotification(e.response.data.message)
            }
            console.log(e)
        }
    }
    return (
        <div>
            <h2 className="text-4xl">Register</h2>
            <form className="my-4" onSubmit={handleSubmit}>
                <div>
                    <p className="my-1">Full Name</p>
                    <input
                        className={Style.Form}
                        type="text"
                        value={name}
                        name="Full Name"
                        id="nmae"
                        onChange={(event) => setName(event.target.value)}
                    />
                </div>
                <div>
                    <p className="my-1">Username</p>
                    <input
                        className={Style.Form}
                        type="text"
                        value={username}
                        name="Username"
                        id="username"
                        onChange={(event) => setUsername(event.target.value)}
                    />
                </div>
                <div className="mt-2">
                    <p className="my-1">Password</p>
                    <input
                        className={Style.Form}
                        type="password"
                        value={password}
                        name="Password"
                        id="password"
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </div>
                <button
                    className={Style.Button + ' my-4'}
                    type="submit"
                    id="loginbutton"
                >
                    Register
                </button>
            </form>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
    }
}

const mapDispatchToProps = {
    setNotification,
}

const connectedRegisterForm = connect(
    mapStateToProps,
    mapDispatchToProps
)(RegisterForm)

export default connectedRegisterForm
