"use client"
import { UserCreationRequest } from '@/app/lib/data/dto/request_types';
import { UserResponse } from '@/app/lib/data/dto/response_types';
import UserData from '@/app/lib/data/user_data';
import DateUtils from '@/app/lib/utils/date_utils';
import Search from '@/app/ui/dashboard/search/search';
import styles from '@/app/ui/users/users.module.css';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const UserPage = () => {
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');

    // Fetch all users
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const usersList = await UserData.getUsers();
            setUsers(usersList);
        } catch (err) {
            setError('Failed to fetch users');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    // Create a new user (example function)
    const createUser = async (newUser: UserCreationRequest) => {
        try {
            const createdUser = await UserData.createUser(newUser);
            setUsers(prev => [...prev, createdUser]); // Add the new user to the state
        } catch (err) {
            setError('Failed to create user');
            console.error(err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Hàm để tìm kiếm người dùng
    const filteredUsers = users.filter(user => {
        return user.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <div className={styles.container}>
            <div className={styles.head}>
                <Search onSearch={handleSearch} />
                <button className={styles.btnAdd}>
                    <Link href={'/dashboard/users/add'}>
                        Add New
                    </Link>
                </button>
            </div>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <td>Avatar</td>
                        <td>Email</td>
                        <td>Created at</td>
                        <td>Action</td>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map((user) => (
                        <tr key={user.uid}>
                            <td className={styles.userName}>
                                <div className={styles.avatar}>
                                    <img className={styles.avatarImage} src={user.photoURL || '/user.png'} alt="" />
                                </div>
                                {user.displayName || "user name"}
                            </td>
                            <td>{user.email}</td>
                            <td>{DateUtils.convertUtcToVietnamDate(user.creationTime)}</td>
                            <td>
                                <div className={styles.btns}>
                                    <Link href={`/dashboard/users/${user.uid}`}>
                                        <button className={`${styles.button} ${styles.view}`}>
                                            View
                                        </button>
                                    </Link>
                                    <form>
                                        <input type="hidden" value={user.uid} name="_id" />
                                        <button className={`${styles.button} ${styles.delete}`}>Delete</button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserPage;
