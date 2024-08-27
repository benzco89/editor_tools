import React from 'react'
import styles from './Footer.module.css'

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <p>&copy; 2023 שם החברה שלך. כל הזכויות שמורות.</p>
      </div>
    </footer>
  )
}

export default Footer