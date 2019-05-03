import React, { Component } from 'react';
import UserBar from './user-bar';
import { auth } from '../Auth/auth';
import firebase from 'firebase';
import Loading from '../components/loading';
import M from 'materialize-css';
import ChannelInfo from './channelInfo';
import SearchUser from './search-user';
import swal from 'sweetalert';
import moment from 'moment';

var _db = firebase.database();

export default class Messenger extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            userData: '',
            groupName: [],
            grpInfo: [],
            loading: false,
            profileName: '',
            newMessage: '',
            condition: false,
            filteredName: [],
            filteredInfo: [],
            yourGroup: [],
            height: window.innerHeight,
            channel: false,
            searchUser: '',
            showSearchUser: false,
            userFromProp: [],
            members: []
        }
        this.scrollMessagesToBottom = this.scrollMessagesToBottom.bind(this);
        this._onResize = this._onResize.bind(this);
    }
    _newMessage = (yourGroup) => {
        var arr = []

        _db.ref(`/groupChat/${yourGroup[0].groupName}`).orderByChild('messages').limitToLast(1).on('child_added', (data) => {

            if (data.val() && data.val().messages) {
                arr.push(data.val().messages)
                this.setState({
                    newMessage: arr
                })
            }
        })


    }
    sendMessage = (groupName) => {

        var val = document.querySelector('.textarea');
        auth.onAuthStateChanged(cred => {
            if (cred && (val.value.length) !== 0 && val.value) {
                _db.ref(`/groupChat/${groupName}/`).push({
                    messages: {
                        id: cred.uid,
                        username: cred.displayName,
                        messages: val.value,
                        groupName: groupName
                    }
                })
                val.value = "";
            }
        })
    }

    scrollMessagesToBottom() {
        if (this.messagesRef) {
            this.messagesRef.scrollTop = this.messagesRef.scrollHeight;
        }
    }
    _onResize() {

        this.setState({
            height: window.innerHeight
        });
    }
    componentDidUpdate() {
        this.scrollMessagesToBottom();
    }

    componentWillMount() {
        window.removeEventListener('resize', this._onResize)
    }

    _onCreateChannel = () => {
        this.setState({ channel: true })
    }
    changeState = (e) => {
        this.setState({ channel: e })
    }
    _getGroup = (key) => {

        var elem = document.querySelector(`#chanel${key}`);
        var elem2 = document.getElementsByClassName('chanel');
        var grpName = elem.lastElementChild.firstElementChild.innerHTML;

        for (var a = 0; a < elem2.length; a++) {
            elem2[a].setAttribute('class', 'chanel');
        }
        _db.ref(`/groupChat/${grpName}`).on('value', (data) => {
            if (data.val()) {
                this.setState({
                    grpInfo: Object.values(data.val())
                })
                elem.setAttribute('class', 'chanel active notify')
            }
        })

    }
    PartOfGroup = () => {
        const { profileName, grpInfo, members } = this.state;
        var admin = false, member = false;
        grpInfo.map(data => {

            if (data.admin === profileName && data.id === auth.currentUser.uid) {
                admin = true
            }
        });
        members.map(data => {
            Object.keys(data).map(mem => {

                if (mem === profileName) {
                    member = true
                }
            })
        })


        if (grpInfo.length !== 0 && admin) {
            this.sendMessage(grpInfo[0].groupName)
        }
        else if (members.length !== 0 && member) {
            this.sendMessage(grpInfo[0].groupName)
        } else {
            swal('info', 'you are not a part of this group');
        }

    }
    groupByCategory = (groupType) => {
        var name = [];
        var info = []
        _db.ref('/groupChat/').on('value', (data) => {
            data.forEach(res => {
                name = [];
                info = []
                res.forEach(grpData => {
                    var grp = grpData.val();
                    if (grp.gender !== undefined && grp.gender === groupType) {
                        _db.ref(`/groupChat/${grp.groupName}`).on('value', (data) => {

                            var filteredGrpName = grp.groupName;
                            var filteredGrpInfo = Object.values(data.val());
                            name.push(filteredGrpName);
                            info.push(filteredGrpInfo)
                        })

                        this.setState({
                            filteredName: name,
                            filteredInfo: info,
                            condition: false
                        })
                    } else {
                        return null
                    }
                })

            })
        })
    }
    option = () => {
        const { condition } = this.state;
        if (condition) {
            this.setState({
                condition: false
            })
        } else {
            this.setState({
                condition: true
            })
        }

    }
    AddToGroup = () => {
        var arr = []
        const { grpInfo, profileName } = this.state;
        var member = false
        var arr = Object.keys(grpInfo[grpInfo.length - 1]);
        var memberData;
        if (arr.length !== 0) {
            var data = Object.values(grpInfo[grpInfo.length - 1])
            data.map(doc => {
                memberData = Object.values(doc);
                memberData.filter(data => {
                    if (data.id !== auth.currentUser.uid) {
                        member = true
                    }
                })
                if (member) {

                    _db.ref(`/groupChat/${grpInfo[0].groupName}/members/${profileName}`).push({
                        id: auth.currentUser.uid,
                        name: profileName,
                        joined: `${new Date().getTime()}`,
                        groupName: `${grpInfo[0].groupName}`
                    }).then(res => {
                        swal('success', 'added to the group', { icon: 'success' })
                    })

                } else if (memberData.map(data => data.id === auth.currentUser.uid)) {
                    swal('info', 'already added', { icon: 'info' })
                }

            })

        } else if (arr.length === 0) {
            _db.ref(`/groupChat/${grpInfo[0].groupName}/members/${profileName}`).push({
                id: auth.currentUser.uid,
                name: profileName,
                joined: `${new Date().getTime()}`,
                groupName: `${grpInfo[0].groupName}`
            })
        }

    }

    LeaveGroup = () => {
        const { grpInfo, profileName } = this.state;
        _db.ref(`/groupChat/${grpInfo[0].groupName}/members/`).child(`${profileName}`).remove().then(res => {
            swal('success', 'removed successfully', { icon: 'success' })
        })
    }
    render() {
        const style = {
            height: `${height} !important`,
        };

        const { loading, height, profileName,
            profileImg, channel, yourGroup, grpInfo, newMessage,
            condition, filteredInfo, filteredName, searchUser,
            showSearchUser, userFromProp, members } = this.state;

        return (
            <div>
                {channel ?
                    <ChannelInfo
                        show={() => this.changeState()}
                        render={this.state.channel} /> :
                    null}

                <div style={style} className="app-messenger">

                    {loading ?
                        <Loading /> :
                        //************* Headers **********
                        <div>
                            <div className="header">
                                <div className="left">
                                    <h6 style={{ textAlign: "center" }}> Group Chat</h6>
                                    <button
                                        onClick={this.option}
                                        className="left-action">
                                        <i className='material-icons'>view_comfy</i>
                                    </button>
                                    <button onClick={() => {
                                        this._onCreateChannel()
                                    }} className="right-action"><i
                                            className="icon-edit-modify-streamline" /></button>

                                </div>
                                {condition ?
                                    <div className='user-bar' >
                                        <div className='user-menu'>
                                            <h6 style={{ textAlign: "center" }}>Group Categories</h6>
                                            <ul className="menu">
                                                <li onClick={() => this.groupByCategory('Men')}>
                                                    <button>
                                                        Men
                                                    </button>
                                                </li>
                                                <li onClick={() => this.groupByCategory('Woman')}>
                                                    <button>
                                                        Woman
                                                     </button>
                                                </li>
                                                <li onClick={() => this.groupByCategory('Transgender')}>
                                                    <button>
                                                        Transgender
                                                    </button>
                                                </li>
                                                <li onClick={() => this.groupByCategory('Gay')}>
                                                    <button>
                                                        Gay
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    </div> : null}
                                {/* ********* Header Title and Search Bar ********* */}
                                <div className="content">
                                    {grpInfo.length !== 0 && grpInfo[0].admin === profileName ?

                                        <div className="toolbar " >
                                            <label>To:</label>
                                            <input style={{
                                                width: '50%',
                                                maxWidth: "50%"
                                            }}
                                                onChange={(e) => {
                                                    this.setState({
                                                        searchUser: e.target.value,
                                                        showSearchUser: true
                                                    })
                                                }}
                                                type='text' placeholder="Type Name To Add..." value={searchUser} />
                                            {showSearchUser && searchUser.length !== 0 ?

                                                <SearchUser
                                                    onSelect={(user) => {
                                                        this.setState({
                                                            showSearchUser: false,
                                                            searchUser: '',
                                                            userFromProp: []
                                                        })
                                                    }}
                                                    value={this.state.searchUser}
                                                    groupInfo={grpInfo}
                                                    profileName={profileName}
                                                    profileImg={profileImg}
                                                /> : null}

                                            <h6 style={{ textTransform: 'capitalize' }}>
                                                {grpInfo.length !== 0 ? grpInfo[0].groupName : null}
                                            </h6>
                                        </div> :
                                        (grpInfo.length && members.length) !== 0 &&
                                            members.map(doc => Object.values(doc).map(member => member === profileName)) ?
                                            <div className='toolbar'>
                                                <h6 style={{ textTransform: 'capitalize' }}>
                                                    {grpInfo[0] ? grpInfo[0].groupName : null}
                                                </h6>
                                            </div> : null}
                                </div>
                                <div className="right">
                                    <UserBar profileName={profileName} profileImg={profileImg} />
                                </div>
                            </div>
                            {/* ************Left Side Bar ************** */}
                            <div className="main">
                                <div className="sidebar-left">
                                    <div className="chanels">
                                        {filteredName.length !== 0 ?
                                            filteredName.map((data, key) => {

                                                return (<div key={key} id={`chanel${key}`}
                                                    className="chanel"
                                                    onClick={() => {
                                                        this._getGroup(key)
                                                    }}
                                                >
                                                    <div className="user-image">
                                                        <img src={require('../images/avatar.png')} alt="" />
                                                    </div>
                                                    <div className="chanel-info">
                                                        <span style={{
                                                            fontSize: 15, fontWeight: 'bold',
                                                            textTransform: 'capitalize'
                                                        }}>
                                                            {data}
                                                        </span>

                                                        {filteredInfo.length !== 0 && filteredInfo.map((message, key) => {
                                                            var index = message.length - 1;
                                                            var lastMessage = message[index]
                                                            if (lastMessage && lastMessage.messages && lastMessage.messages.groupName === data) {

                                                                return (<p key={key}>{lastMessage.messages.messages}</p>)
                                                            } else {
                                                                return null
                                                            }
                                                        })}
                                                    </div>
                                                </div>)
                                            }) :
                                            yourGroup.length !== 0 ?
                                                yourGroup.map((data, key) => {

                                                    return (
                                                        <div key={key} id={`chanel${key}`}
                                                            className='chanel'
                                                            onClick={() => {
                                                                this._getGroup(key)
                                                            }}>
                                                            <div className="user-image">
                                                                <img src={require('../images/avatar.png')} alt="" />
                                                            </div>
                                                            <div className="chanel-info">
                                                                <span style={{
                                                                    fontSize: 15, fontWeight: 'bold',
                                                                    textTransform: 'capitalize'
                                                                }}>
                                                                    {data[0].groupName}
                                                                </span>
                                                                {newMessage && newMessage.map((message, key) => {

                                                                    if (message.messages && message.groupName === data[0].groupName) {
                                                                        return (<p key={key}>{message.messages}</p>)
                                                                    } else {
                                                                        return null
                                                                    }
                                                                })}
                                                            </div>
                                                        </div>)
                                                })
                                                : null}
                                    </div>

                                </div>
                                {/* *********** Messages...... ************  */}
                                <div className="content">
                                    <div id="messages" ref={(ref) => this.messagesRef = ref} className="messages">
                                        {grpInfo.length !== 0 ?
                                            grpInfo.map((data, index) => {

                                                return (
                                                    <div key={index}>
                                                        {data.messages !== undefined && data.messages.messages !== undefined ?
                                                            <div key={index} id='chat' >
                                                                {data.messages.username !== profileName ?
                                                                    <div className='message you' >
                                                                        <div className="message-user-image">
                                                                            <img src={profileImg && profileImg.includes(`${data.messages.username}`) ? profileImg : require('../images/avatar.png')} alt="" />
                                                                        </div>
                                                                        <div className="message-body">
                                                                            <div className='author'>{data.messages.username}</div>
                                                                            <div className="message-text">
                                                                                {data.messages.messages}
                                                                            </div>

                                                                        </div>
                                                                    </div>
                                                                    :
                                                                    <div className='message me' >

                                                                        <div className="message-body">
                                                                            <div className='author'>{data.messages.username}</div>
                                                                            <div className="message-text">
                                                                                {data.messages.messages}
                                                                            </div>
                                                                        </div>
                                                                        <div className="message-user-image">
                                                                            <img style={{ marginLeft: 10 }} src={profileImg &&
                                                                                profileImg.includes(`${data.messages.username}`) ?
                                                                                `${profileImg}`
                                                                                : require('../images/avatar.png')} alt="" />
                                                                        </div>
                                                                    </div>}

                                                            </div> :
                                                            null}
                                                    </div>)

                                            }) :
                                            <div className='no-message'>no messages</div>}
                                    </div>
                                    <div className="messenger-input">

                                        <div className="text-input">
                                            <input
                                                style={{
                                                    borderBottom: 0,
                                                    paddingLeft: 10
                                                }}
                                                type='text'
                                                className='textarea'
                                                placeholder="Write your messsage..."
                                            />
                                        </div>
                                        <div className="actions">
                                            <button className="send" style={{
                                                paddingBottom: 10
                                            }}
                                                onClick={() => {
                                                    this.PartOfGroup()
                                                }}
                                            >Send <i className='icon-paperplane' /></button>
                                        </div>
                                    </div>


                                </div>
                                {/* ************Group Info Right SideBar*********** */}
                                <div className="sidebar-right">
                                    <div>
                                        <h6 className='title'> Group Info</h6>

                                        {grpInfo.length !== 0 ? grpInfo.map((data, index) => {

                                            return data.admin ?
                                                <div key={index}>
                                                    <p className='container'>Admin:  <b>{data.admin} </b></p>
                                                    {data.admin === profileName ? <div>
                                                        <p className='container'>Gender: <b>{data.gender}</b></p>
                                                        <p className='container'>Your Package: <b>{data.pricePackage}</b></p>
                                                    </div> : null}


                                                    <h6 className="title">Members</h6>

                                                    {(data.admin === profileName && members.length !== 0) ||
                                                        ((members.length !== 0 &&
                                                            members.filter(doc => Object.keys(doc).filter(member => member === profileName)).length) !== 0)
                                                        ? members.map((doc) => {

                                                            return Object.values(doc).map((member) => {

                                                                return Object.values(member).map((data, index) => {

                                                                    return (
                                                                        <div key={index}>
                                                                            <div className="members">

                                                                                <div className="member">
                                                                                    <div className="user-image">
                                                                                        <img src={profileImg && profileImg.includes(`${data.name}`) ? `${profileImg}` :
                                                                                            require('../images/avatar.png')} alt="" />
                                                                                        <span className='user-status' />
                                                                                    </div>
                                                                                    <div className="member-info">
                                                                                        <h6>{data.name}- <span className='user-status' >
                                                                                            joined:{moment(parseInt(data.joined)).fromNow()}
                                                                                        </span> </h6>
                                                                                    </div>

                                                                                </div>

                                                                            </div>
                                                                        </div>)
                                                                })
                                                            })

                                                        })

                                                        : null}
                                                    {/* // If not a member , join stuff */}
                                                    {(data.admin !== profileName && members.length !== 0
                                                        && members.filter(doc => Object.keys(doc).filter(data => data !== profileName)).length === 0) ||
                                                        data.admin !== profileName && members.length === 0 ?

                                                        <div className='container'>
                                                            <div className='row popup-form'>
                                                                <button
                                                                    style={{
                                                                        padding: 10
                                                                    }}
                                                                    onClick={() => {
                                                                        this.AddToGroup(userFromProp)
                                                                        this.forceUpdate()
                                                                    }}
                                                                    className='col s12 m8 l8 pop-btn' >Join Group
                                                            </button>
                                                            </div>
                                                        </div> :
                                                        // wanna leave the group
                                                        (data.admin !== profileName && (members.length && members.filter(member => Object.keys(member).filter(data => data === profileName)).length) !== 0) ?
                                                            <div className='container'>
                                                                <div className='row popup-form'>
                                                                    <button
                                                                        onClick={() => {
                                                                            this.LeaveGroup()
                                                                            this.forceUpdate()
                                                                        }}
                                                                        className='col s12 m8 l8 pop-btn danger' >Leave Group
                                       </button>
                                                                </div>

                                                            </div> : null}
                                                </div> : null

                                        }) : null}

                                    </div>
                                </div>
                            </div>
                        </div>}
                </div >
            </div>)
    }
    componentDidMount() {
        window.addEventListener('resize', this._onResize);
        this.setState({ loading: true })

        auth.onAuthStateChanged(cred => {
            if (cred) {
                _db.ref(`/groupChat/`).on('value', (res) => {

                    var arr = [];
                    var arr2 = [];
                    var arr3 = []

                    res.forEach(data => {
                        arr3.push(Object.values(data.val()));

                    })

                    if (arr3.length !== 0) {
                        arr3.forEach(data1 => {
                            var condition = false
                            var obj = Object.values(data1);
                            var members = Object.keys((obj[obj.length - 1]));

                            if (!obj[obj.length - 1].hasOwnProperty('messages') && !obj[obj.length - 1].hasOwnProperty('admin')) {

                                for (var a = 0; a < members.length; a++) {
                                    if (members[a] === cred.displayName) {
                                        condition = true
                                        break;
                                    }
                                }
                            }

                            if (obj.length !== 0 && obj[0].id === cred.uid) {

                                arr.push(obj)
                                if (!obj[obj.length - 1].hasOwnProperty('messages') && !obj[obj.length - 1].hasOwnProperty('admin')) {
                                    arr2.push(obj[obj.length - 1])
                                }
                                this.setState({
                                    yourGroup: arr,
                                    loading: false,
                                    members: arr2,
                                    profileImg: cred.photoURL,
                                    profileName: cred.displayName
                                })
                            }
                            else if (obj.length !== 0 && condition) {

                                arr.push(obj)
                                if (!obj[obj.length - 1].hasOwnProperty('messages') && !obj[obj.length - 1].hasOwnProperty('admin')) {

                                    arr2.push(obj[obj.length - 1])
                                }

                                this.setState({
                                    yourGroup: arr,
                                    loading: false,
                                    members: arr2,
                                    profileImg: cred.photoURL,
                                    profileName: cred.displayName
                                })

                            } else if (obj.length === 0 || !condition) {

                                this.setState({
                                    loading: false,
                                    members: [],
                                    profileImg: cred.photoURL,
                                    profileName: cred.displayName
                                })
                            }
                            this._newMessage(obj)
                        })
                    } else {

                        this.setState({
                            loading: false,
                            members: [],
                            profileImg: cred.photoURL,
                            profileName: cred.displayName
                        })
                    }
                })


            } else {
                this.setState({ loading: false })
            }
        })

    }

} 