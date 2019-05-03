import React, { Component } from 'react';

export default class Nav extends Component {
    render() {
        const MinWidth = window.innerWidth <= 1039 && window.innerWidth >= 200;
        return (<nav>
            <div className="nav-wrapper">
                &nbsp;&nbsp;
                &nbsp;&nbsp;
                <a href="/" className={MinWidth ? "brand-logo center" : "brand-logo"}>
                <i className="material-icons medium left" >chat_bubble_outline</i>
                Group Messenger</a>
            </div>
        </nav>)
    }
}