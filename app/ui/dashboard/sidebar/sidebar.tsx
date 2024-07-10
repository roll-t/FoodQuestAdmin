
import React from 'react';
import styles from './sidebar.module.css'

import {
    MdDashboard,
    MdAccountCircle,
    MdOutlineAddShoppingCart,
    MdAttachMoney,
    MdLogout,
    MdOutlinePodcasts,
    MdPostAdd,
    MdCompost,
    MdRestaurant
} from "react-icons/md"
import MenuLink from './menuLink/menuLink';
import Link from 'next/link';

const menuItems = [
    {
        title: "pages",
        list: [
            {
                title: "Dashboard",
                path: "/dashboard",
                icon: <MdDashboard />,
            },
            {
                title: "User",
                path: "/dashboard/users",
                icon: <MdAccountCircle />,
            },
            {
                title: "Posts",
                path: "/dashboard/posts",
                icon: <MdPostAdd/>,
            },
            {
                title: "Restaurant",
                path: "/dashboard/restaurant",
                icon: <MdRestaurant />,
            }
        ]
    },
    // {
    //     title: "Analytics",
    //     list: [
    //         {
    //             title: "Dashboard",
    //             path: "/analtics",
    //             icon: <MdDashboard />,
    //         },
    //         {
    //             title: "User",
    //             path: "/Analytics/users",
    //             icon: <MdAccountCircle />,
    //         },
    //         {
    //             title: "Products",
    //             path: "/Analytics/products",
    //             icon: <MdOutlineAddShoppingCart />,
    //         }
    //     ]
    // },
    // {
    //     title: "User",
    //     list: [
    //         {
    //             title: "Dashboard",
    //             path: "/user",
    //             icon: <MdDashboard />,
    //         },
    //         {
    //             title: "User",
    //             path: "/User/users",
    //             icon: <MdAccountCircle />,
    //         }
    //     ]
    // }

]

const Sidebar = () => {
    return (
        <div className={styles.container}>
            <div className={styles.user}>
                <img className={styles.userImg} src="/user.png" alt="" width='50' height='50' />
                <div className={styles.userDetail}>
                    <span className={styles.userName}>Phuoc truong</span>
                    <span className={styles.userTitle}>admin</span>
                </div>
            </div>
            <ul className={styles.list}>
                {
                    menuItems.map(cat => (
                        <li key={cat.title}>
                            <span className={styles.cat}>{cat.title}</span>
                            {cat.list.map(item => (
                                <MenuLink item={item} key={item.title} />
                            ))}
                        </li>
                    ))
                }
            </ul>
            <Link href={'/login'}>
                <button className={styles.logout}>
                    <MdLogout />
                    Logout
                </button>
            </Link>
        </div>
    );
};

export default Sidebar;