import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { SignOut } from '../Auth/auth';

export default class UserBar extends Component {

    constructor() {
        super();
        this.state = {
            condition: false
        }
    }

    Menu = () => {
        const { condition } = this.state
        if (condition) {
            this.setState({ condition: false })
        } else {
            this.setState({ condition: true })
        }
    }
    render() {
        const { condition } = this.state;
        const { profileName, disabled, profileImg } = this.props;
        
        return (
            <div className="user-bar" >
                <div className="profile-name" >
                    <h6>{profileName ? profileName : null}</h6>
                </div>
                <div className="profile-image" onClick={this.Menu}>
                    <img src={profileImg ? `${profileImg}` : require("../images/avatar.png")} alt="" />
                </div>
                <div className="user-menu">
                    {condition && !disabled ?
                        <div>
                            <h6 style={{ textAlign: "center" }}>My menu</h6>
                            <ul className="menu">
                                <Link to="/profile">
                                    <li>
                                        <button>
                                            Setting
                            </button>
                                    </li>
                                </Link>
                                <li
                                    onClick={(e) => SignOut(e)}
                                ><button
                                    type="button">
                                        Sign Out
                                </button></li>
                            </ul>

                        </div> : null}
                </div>
            </div>
        );
    }
}