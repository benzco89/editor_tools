import React from 'react';
import styles from './LogoEmbed.module.css';

interface LogoEmbedProps {
  logoUrl: string;
  size: number;
}

const LogoEmbed: React.FC<LogoEmbedProps> = ({ logoUrl, size }) => {
  return (
    <div className={styles.logoContainer} style={{ width: size, height: size }}>
      <img src={logoUrl} alt="Embedded Logo" className={styles.logo} />
    </div>
  );
};

export default LogoEmbed;