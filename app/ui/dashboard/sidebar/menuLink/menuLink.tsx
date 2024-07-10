'use client'
import Link from 'next/link';
import styles from './menuLink.module.css'
import React, { use } from 'react';
import { usePathname } from 'next/navigation';

const MenuLink = ({item}:any) => {
    const pathName=usePathname()
    return (
        <Link href={item.path} className={`${styles.container} ${pathName===item.path && styles.active}`}>
            {item.icon}
            {item.title}
            </Link>
        );
};

export default MenuLink;