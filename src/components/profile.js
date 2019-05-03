import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import UserBar from './user-bar';
import { auth, storageRef, db } from '../Auth/auth';
import Messages from './messenger';
import Loading from './loading';
import swal from 'sweetalert';

export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: '',
            id: '',
            email: '',
            profileUrl: '',
            gender: '',
            state: '',
            country: '',
            interest: '',
            loading: false
        }
        this.ChangeImage = this.ChangeImage.bind(this)
        this.uploadProfileImg = this.uploadProfileImg.bind(this)
    }
    componentDidMount() {

        auth.onAuthStateChanged(cred => {
            this.setState({
                userData: cred.displayName,
                email: cred.email
            })
        })
        this.getInfo()

    }

    getInfo = () => {
        this.setState({ loading: true })
        db.collection(`userData`).doc(`${auth.currentUser.uid}`).get().then(docs => {
            Object.values(docs.data()).map(data => {
                this.setState({
                    country: data[0].country,
                    gender: data[0].gender,
                    interest: data[0].interest,
                    state: data[0].state
                })

            })

            this.setState({ loading: false })
        }).catch(err => {
            this.setState({ loading: false })
        })
    }
    ChangeImage = (e) => {
        const imgPath = e.target.files[0];

        if (e.target.files) {

            var reader = new FileReader();
            reader.onload = function () {
                var output = document.getElementById('output_image');
                output.src = reader.result;

            }

            reader.readAsDataURL(imgPath);
            this.uploadProfileImg(imgPath);
        }
    }

    uploadProfileImg = async (file) => {
        var btn = document.getElementById('update');
        var user = auth.currentUser;
        var storage = storageRef.ref(user.displayName + '/profilePicture/' + file.name);

        await storage.put(file, { merge: true }).then(data => {
            storage.getDownloadURL()
                .then(url => {
                    console.log('done!!');
                    user.updateProfile({
                        photoURL: url
                    })
                    this.setState({
                        loading: false
                    })
                })
                .catch(err => {
                    this.setState({
                        loading: false
                    })
                    console.log('error while getting the url');
                })
        }).catch(err => {
            this.setState({
                loading: false
            })
            console.log('error while storing the data to Storage');

        })

    }

    UpdateInfo = () => {

        var data = []
        var { gender, userData, country, interest, state } = this.state;

        data.push({
            state: state,
            gender: gender,
            country: country,
            interest: interest
        })



        db.collection('userData').doc(`${auth.currentUser.uid}`).set({
            data
        }).then(() => {
            console.log('added!!!');
            this.setState({
                loading: false
            })

        })
            .then(() => {
                swal('success', 'updated successfully', { icon: 'success' })
            })
            .catch(err => {
                this.setState({
                    loading: false
                })
            })


        auth.currentUser.updateProfile({
            displayName: userData
        })

    }

    render() {

        const { userData, profileUrl, email, gender, interest, state, country } = this.state;
        const btn = document.getElementById('update');

        return (
            <div>
                {this.state.loading ? <Loading /> :
                    <div className="profile-navbar app-messenger" >
                        <div className="header">
                            <div className="back left">
                                <Link to="/" ><h6  > Back</h6></Link>

                            </div>
                            <div className="content">
                                <div className="toolbar">
                                    <h6> User Profile</h6>
                                </div>
                            </div>
                            <div className="right">
                                <UserBar disabled={true} profileName={userData} profileImg={profileUrl} />
                            </div>
                        </div>
                        <div className='container'>
                            <div className="row ">
                                <div className='col s12 m12 l12' >
                                    <div className='profile'>
                                        <div className="user-img" >
                                            <img
                                                id='output_image'
                                                onClick={() => document.getElementById('file').click()}
                                                style={{
                                                    minHeight: 100,
                                                    minWidth: 100,
                                                    maxHeight: 100,
                                                    maxWidth: 100
                                                }}
                                                src={profileUrl ? `${profileUrl}` : require('../images/avatar.png')} alt="" />
                                            <br />
                                            <input id='file' type='file' accept='image/*' style={{ display: 'none' }} onChange={(e) => {
                                                this.ChangeImage(e);
                                                if (btn !== null) {
                                                    btn.removeAttribute('class', 'grey')
                                                }
                                            }} />
                                        </div>
                                        <div className="profile-form" >

                                            <input type="text"
                                                onChange={(e) => {
                                                    this.setState({
                                                        userData: e.target.value
                                                    })
                                                    if (btn !== null) {
                                                        btn.removeAttribute('class', 'grey')
                                                    }
                                                }}
                                                value={userData} />

                                            <input type="email" value={email}
                                                disabled />

                                            <input type="text" placeholder='Gender'
                                                onChange={(e) => {
                                                    this.setState({
                                                        gender: e.target.value
                                                    })
                                                    if (btn !== null) {
                                                        btn.removeAttribute('class', 'grey')
                                                    }
                                                }}
                                                value={gender} />

                                            <input type="text" placeholder='Country'
                                                onChange={(e) => {
                                                    this.setState({
                                                        country: e.target.value
                                                    })
                                                    if (btn !== null) {
                                                        btn.removeAttribute('class', 'grey')
                                                    }
                                                }}
                                                value={country} />

                                            <input type="text" placeholder='State'
                                                onChange={(e) => {
                                                    this.setState({
                                                        state: e.target.value
                                                    })
                                                    if (btn !== null) {
                                                        btn.removeAttribute('class', 'grey')
                                                    }
                                                }}
                                                value={state} />

                                            <input type="text" placeholder='Interested In'
                                                onChange={(e) => {

                                                    this.setState({
                                                        interest: e.target.value
                                                    })
                                                    if (btn !== null) {
                                                        btn.removeAttribute('class', 'grey')
                                                    }
                                                }}
                                                value={interest} />
                                            <button id="update" className='grey' onClick={() => {
                                                this.setState({ loading: true })
                                                this.UpdateInfo();
                                                this.forceUpdate()

                                            }}>Update</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>}
            </div>)
    }
} 