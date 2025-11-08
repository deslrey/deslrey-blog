import React from 'react'
import './index.css'

const LoaderComponent: React.FC = () => {
    return (
        <div className="loader-container">
            <div className="loader">
                <div className="wrapper">
                    <div className="circle"></div>
                    <div className="line-1"></div>
                    <div className="line-2"></div>
                    <div className="line-3"></div>
                    <div className="line-4"></div>
                </div>
            </div>
        </div>
    )
}

export default LoaderComponent
