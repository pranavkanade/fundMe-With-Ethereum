import React from 'react';

export default (props) => {
    return (
        <div>
            <h1>I m header</h1>
            {props.children}
            <h1>I m footer</h1>
        </div>
    );
};