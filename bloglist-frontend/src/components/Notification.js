import React from 'react'

const Notification = ({ message, success }) => {
    if (message === null){
        return null
    }
    let color = 'green'
    if(success === false){
        color = 'red'
    }
    return (
        <div className="message" style={{ color: color }}>
            {message}
        </div>
    )
}

export default Notification