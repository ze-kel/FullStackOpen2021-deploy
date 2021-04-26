import React from 'react'
import { connect } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import Style from './GenericStyles'

const UserList = (props) => {
    if (!props.user) {
        return <Redirect to="/login" />
    }
    return (
        <div>
            <h2 className="text-4xl mb-4">Users</h2>
            <div className={Style.ClickableListContaier}>
                {props.userList.map((user) => (
                    <Link
                        key={user.id}
                        className={
                            Style.ClickableListItem + ' flex justify-between'
                        }
                        to={'/users/' + user.id}
                    >
                        <p>{user.name}</p> <p>{user.entries.length} Blogs</p>
                    </Link>
                ))}
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        userList: state.userList,
        user: state.user,
    }
}

const connectedUserList = connect(mapStateToProps)(UserList)

export default connectedUserList
