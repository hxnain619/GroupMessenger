import React from 'react';
import { auth, db } from '../Auth/auth';
import firebase from 'firebase';
import swal from 'sweetalert';

var _db = firebase.database();

export default class SearchUser extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            users: [],
            groupInfo: []
        }
        this.handleOnClick = this.handleOnClick.bind(this)
    }
    componentDidMount() {
        this.setState({
            groupInfo: this.props.groupInfo
        })
        this._getUsers();

    }

    handleOnClick = (user) => {

        if (this.props.onSelect) {
            this.props.onSelect(user)
        }
        const { groupInfo, users } = this.state;
        const { profileName } = this.props;


        if (!groupInfo[groupInfo.length - 1].hasOwnProperty('messages') && !groupInfo[groupInfo.length - 1].hasOwnProperty('admin')) {

            var members = Object.keys(groupInfo[groupInfo.length - 1]);
            var admin = Object.values(groupInfo[0])[0];
            var condition = false
            members.map(member => {
                if (member === user.name) {
                    condition = true
                }

            })
            if (admin === user.name) {
                condition = true
            }

            if (!condition) {
                _db.ref(`/groupChat/${groupInfo[0].groupName}/members/${user.name}/`).push({
                    name: user.name,
                    joined: `${new Date().getTime()}`
                })

            } else {
                swal('info', 'already added!!', { icon: 'info' });
            }

        } else {

            _db.ref(`/groupChat/${groupInfo[0].groupName}/members/${user.name}/`).push({
                name: user.name,
                joined: `${new Date().getTime()}`
            })

        }

    }

    _getUsers = () => {
        var arr = [];
        const groupInfo = this.props.groupInfo;

        db.collection('userList').orderBy('name').startAt(this.props.value).get().then(querySnapshot => {

            querySnapshot.forEach(doc => {

                var data = doc.data();
                if (!groupInfo[groupInfo.length - 1].hasOwnProperty('messages') && !groupInfo[groupInfo.length - 1].hasOwnProperty('admin')) {

                    var members = Object.keys(groupInfo[groupInfo.length - 1]);
                    var admin = Object.values(groupInfo[0])[0];
                    var condition = false
                    members.map(member => {
                        if (member === data.name) {
                            condition = true
                        }

                    })
                    if (admin === data.name) {
                        condition = true
                    }
                    if (!condition) {
                        arr.push(data)
                    }

                }

            })
            this.setState({
                users: arr
            })
        })
    }
    render() {
        const { users, groupInfo } = this.state;
        const { profileImg } = this.props;
        return (<div className='search-user' >
            <div className='user-list'>

                {users.length !== 0 ?
                    users.map((user, key) => {
                        return (<div
                            key={key}
                            className="user"
                            onClick={() => this.handleOnClick(user)}>
                            <img src={profileImg && profileImg.includes(`${user.name}`) ? `${profileImg}` : require('../images/avatar.png')} alt='' />
                            <h6 style={{
                                paddingLeft: 10
                            }}>{user.name}</h6>
                        </div>)
                    }) :
                    <div
                        className="user"
                        style={{
                            padding: 10
                        }}
                    >  No User Found!! </div>}
            </div>
        </div>)
    }
}   