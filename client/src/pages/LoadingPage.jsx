import React from 'react'
import CircularProgress from '@mui/material/CircularProgress';


const LoadingPage = () => {
    return (
        <div className="loading-wrapper" style={{
            "height": "100vh",
            "width": "100vw",
            "display": "flex",
            "alignItems": "center",
            "justifyContent": "center"
        }}>
            <CircularProgress size={"3rem"} />
        </div >
    )
}

export default LoadingPage