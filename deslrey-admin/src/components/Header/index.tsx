import React from 'react'

import styles from './index.module.scss'
import { useTime } from '../../hooks/useTime'

import avatar from '../../assets/images/avatar.jpg'

const Header: React.FC = () => {

    const { timeText } = useTime()

    return (
        <div className={styles.headerBox}>
            <div className={styles.leftBox}>
                <img src={avatar} alt="avatar" className={styles.avatar} />
            </div>

            <div className={styles.midBox}>
                中间
            </div>
            <div className={styles.rightBox}>
                {timeText}
            </div>
        </div>
    )
}

export default Header