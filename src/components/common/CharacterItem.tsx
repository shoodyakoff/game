import React from 'react';
import { motion } from 'framer-motion';
import styles from './CharacterItem.module.css';

interface ItemProps {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: string;
}

interface CharacterItemProps {
  item: ItemProps;
  className?: string;
}

export const CharacterItem: React.FC<CharacterItemProps> = ({ item, className }) => {
  const [isEquipped, setIsEquipped] = React.useState(false);

  const handleToggleEquip = () => {
    setIsEquipped(!isEquipped);
  };

  return (
    <motion.div
      className={`${styles.item} ${isEquipped ? styles.equipped : ''} ${className || ''}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className={styles.icon}>{item.icon}</div>
      <div className={styles.info}>
        <h4 className={styles.title}>{item.title}</h4>
        <p className={styles.description}>{item.description}</p>
      </div>
      <button
        className={`${styles.equipButton} ${isEquipped ? styles.equipped : ''}`}
        onClick={handleToggleEquip}
      >
        {isEquipped ? 'Снять' : 'Надеть'}
      </button>
    </motion.div>
  );
}; 