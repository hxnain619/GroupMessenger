import React from 'react';
import { Link } from 'react-router-dom';
import Img from '../images/home.png';
import { Register } from '../Auth/auth';
import Nav from './nav';

const MinWidth = window.innerWidth <= 950 && window.innerWidth >= 200;
export default class SignUp extends React.Component {
    render() {
        return (
            <div className="signUp container ">
            <div className="body" ></div>
                <Nav />
                <div className={MinWidth ? "row" : "row right"} >
                    <div className={MinWidth ? "popup-card2 col m4 s12 l12 mobile-view" : "popup-card2"}>
                        <div className="popup-form" >
                            <span className="heading" >
                                <h3 >Register </h3>
                            </span>
                            <input className='profile-name' type='text' placeholder='Enter Your Name' />
                            <input className="signUp-email" type="email" placeholder="Enter Email" />
                            <input className="signUp-pass" type="password" placeholder="Enter Password" />
                            <button id="signUp-mail"
                                onClick={(e) => Register(e, this)}
                                className="pop-btn ">Sign Up</button>
                            <br />
                            <span >Already A Member ? <Link to="/" className="pink" >Sign In</Link></span>
                        </div>
                    </div>
                </div>
                        {MinWidth ? null :
                            <div className="home-img">
                                <div className="home-title" >
                                    <h1 className="main" >Be Together</h1>
                                    <p>Instant messaging and group chat rooms.</p>
                                </div>
                                <img className='right' src={Img} alt="" />
                            </div>}
                        {MinWidth ?
                            this.pageRefesh() : null}
            </div>
        )
    }
    pageRefesh = () => {
        window.onresize = () => {
            this.forceUpdate();
        }
    }
}