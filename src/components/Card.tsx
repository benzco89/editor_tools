import React from 'react';
import styles from './Card.module.css';

interface CardProps {
  children: React.ReactNode;
  title?: string;
}

const Card: React.FC<CardProps> = ({ children, title }) => {
  return (
    <div className={styles.card}>
      {title && <h2 className={styles.cardTitle}>{title}</h2>}
      <div className={styles.cardContent}>{children}</div>
    </div>
  );
};

export default Card;