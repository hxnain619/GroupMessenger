import React from 'react';
import M from 'materialize-css';
import { auth } from '../Auth/auth';
import firebase from 'firebase';
import Messages from './messenger';

var _db = firebase.database();

export default class ChannelInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            groupName: '',
            show: false
        }
    }
    CreateGroup = (e) => {
        var topic = document.getElementById('topic');
        var gender = document.getElementById('gender');
        var pkg = document.getElementById('pkg');

        var opt = pkg.childElementCount;
        var selectedPkg, selectedOpt;
        for (var a = 0; a < opt; a++) {
            var select = pkg.getElementsByTagName('option')[a];
            if (select.selected) {
                selectedPkg = select.innerHTML;
            }
        }
        for (var b = 0; b < opt; b++) {
            var select = gender.getElementsByTagName('option')[b];
            if (select.selected) {
                selectedOpt = select.innerHTML;
            }
        }
        this.setState({ loading: true, groupName: topic.value })
        auth.onAuthStateChanged(cred => {
            if (cred) {
                var group = topic.value;
                return _db.ref(`/groupChat/${group}`).push({
                    groupName: topic.value,
                    id: cred.uid,
                    admin: cred.displayName,
                    pricePackage: selectedPkg,
                    gender: selectedOpt
                }).then(res => {
                    this.setState({ loading: false })

                }).catch(err => {
                    this.setState({ loading: false })
                })
            }
        })
    }

    render() {
        const { render } = this.props;
        return (
            <div>
                {render ?
                    <div id='channel' className='container'>
                        <h4>Create New Group</h4>
                        <div className='row popup-form'>
                            <div className='input-field col s12'>
                                <input id='topic' type='text' placeholder='Enter Your Subject' />
                            </div>
                            <div className="input-field col s12">
                                <select id='gender'>
                                    <option value="" disabled defaultValue>Choose your Gender</option>
                                    <option value="1" >Men</option>
                                    <option value="2">Woman</option>
                                    <option value="3">Gay</option>
                                    <option value="4">Transgender</option>
                                </select>
                                <label>Select Gender</label>
                            </div>

                            <div className="input-field col s12">
                                <select id='pkg'>
                                    <option value="" disabled defaultValue>How Long Do You Want This?</option>
                                    <option value="1" >3 Days - $3.75</option>
                                    <option value="1">Week - $5.55</option>
                                    <option value="2">2 Weeks - $8.89</option>
                                    <option value="3">A Month - $15.35</option>
                                </select>
                                <label>Select Package</label>
                            </div>
                            <button className="pop-btn"
                                onClick={() => {
                                    this.CreateGroup()
                                    this.props.show(false)
                                }}
                            >Create</button>
                            <button className="pop-btn"
                                onClick={() => {
                                    this.props.show(false)
                                    this.forceUpdate()
                                }}
                            >Cancel</button>
                        </div>
                    </div> : null}
            </div>
        )
    }
    componentDidMount() {
        let select = document.querySelectorAll('select');
        M.FormSelect.init(select);
    }

}
