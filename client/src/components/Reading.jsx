import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import './Reading.css';

class Reading extends React.Component {
    static props = {
        dispatch: PropTypes.func,
        bookPath: PropTypes.string,
        bookTitle: PropTypes.string,
        bookCurrentPage: PropTypes.number,
        bookTotalPages: PropTypes.number,
    };

    constructor(props) {
        super(props);

        this.test();
    }

    render() {
        return (
            <div className='container'>
                {this.props.bookPath} <br/>
                {this.props.bookTitle} <br/>
                {this.props.content} <br/>
                {this.props.bookCurrentPage} <br/>
                {this.props.bookTotalPages} <br/>
            </div>
        );
    }

    test() {
        var data = require('../../dist/data/test.json');
        console.log(data);
    }
}

export default connect(state => ({
    ...state.reading,
}))(Reading);