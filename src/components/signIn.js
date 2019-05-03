import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Img from '../images/home.png';
import { login } from '../Auth/auth';
import { Reset } from '../Auth/auth';
import Nav from './nav';

export default class SignIn extends Component {
    constructor() {
        super();
        this.state = {
            condition: false
        }
    }

    render() {
        const MinWidth = window.innerWidth <= 950 && window.innerWidth >= 200;
        return (<div className="signIn container ">
            <div className="body "></div>
            <Nav />
            <div className={MinWidth ? "row left" : "row right"} >
                <div className={MinWidth ? "popup-card col s12 m8 l8 mobile-view" : "popup-card left"} >
                    <div className="popup-form " >
                        <span className="heading" >
                            <h3 >Sign In </h3>
                        </span>
                        <input id="signIn-email" type="email" placeholder="Enter Email" />
                        <input id="signIn-pass" type="password" placeholder="Enter Password" />
                        <button
                            className="pop-btn border-loads"
                            onClick={(e) => {
                                login(e)
                            }}
                        >Sign In</button>
                        <br />
                        <p
                            onClick={() => {
                                this.setState({ condition: true })
                                this.forceUpdate()
                            }}
                        ><Link to="#!" className=" pink" >Forgot Password</Link>&nbsp;&nbsp;
                    &nbsp;&nbsp;<Link to="/signup" className="pink">Have An Account?</Link>
                        </p>


                    </div>
                </div>
                {MinWidth ? null :
                    <div className="home-img right">
                        <div className="home-title" >
                            <h1 className="main" >Connect With Us</h1>
                            <p>We really owe it to our world to infuse our entertainment with messaging.</p>
                        </div>
                        <img src={Img} alt="" />
                    </div>}
                {MinWidth ?
                    this.pageRefesh() : null}
            </div>
            {/* Forogt Pass Form */}
            {this.state.condition ? <div className='bg' ></div> : null}
            <div className={(this.state.condition) ? "show container center" : "hide"} >
                <div className='row'>
                    <div className='col s12 m12 l12'>
                        <h4>Forgot Password <i onClick={() => this.setState({ condition: false })} className='material-icons pink right'>clear</i></h4>
                        <input id='forgot-email' type='email' placeholder='Enter Your EMail' />
                        <button
                            className='forgot-btn'
                            onClick={(e) => Reset(e, this)}
                        >Reset</button>
                    </div>
                </div>
            </div>

        </div>)
    }

    pageRefesh = () => {
        window.addEventListener('resize', () => {
            this.forceUpdate();
        })
    }


} 