import { initializeApp } from 'firebase/app';
import { collection, doc, getDoc, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { User } from './interface/user';
import { UserModel } from './models'; // Ensure this is correctly imported
import firebaseConfig from './utils'; // Ensure this is correctly configured

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const firestore = getFirestore(app);


export async function fetchAllUsers() {
  const usersCollection = collection(firestore, 'users'); // Reference to the 'users' collection

  try {
    const snapshot = await getDocs(usersCollection);
    const users = snapshot.docs.map((doc) => UserModel.fromDocumentSnapshot(doc)); // Convert each document to UserModel
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }
}

export async function fetchSingleUser(id: string): Promise<UserModel | null> {
  try {
    const userDoc = await getDoc(doc(firestore, 'users', id));
    if (userDoc.exists()) {
      return UserModel.fromDocumentSnapshot(userDoc);
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    throw new Error('Failed to fetch user');
  }
}

export async function fetchTopUsersByPostCount(): Promise<User[]> {
  try {
    // Get a collection reference to 'posts'
    const postsCollection = collection(firestore, 'posts');
    
    // Aggregate user post counts
    const userPostCounts = new Map<string, number>();

    // Get all posts
    const postsSnapshot = await getDocs(postsCollection);
    postsSnapshot.forEach((doc) => {
      const post = doc.data();
      const userId = post.userId; // Assuming each post has a 'userId' field
      
      // Increment post count for the user
      userPostCounts.set(userId, (userPostCounts.get(userId) || 0) + 1);
    });

    // Convert the map to an array of user post count objects
    const usersWithPostCounts = Array.from(userPostCounts.entries()).map(([userId, postCount]) => ({
      userId,
      totalPosts: postCount
    }));

    // Sort users by post count in descending order and take the top 4
    usersWithPostCounts.sort((a, b) => b.totalPosts - a.totalPosts);
    const topUsers = usersWithPostCounts.slice(0, 4);

    // Fetch user details for the top users
    const userCollection = collection(firestore, 'users');
    
    // Create a query to get the details of all top users in one go
    const userIds = topUsers.map(user => user.userId);
    const userQuery = query(userCollection, where('uid', 'in', userIds)); // Adjust field name as needed
    
    const userDetailsSnapshot = await getDocs(userQuery);
    const userDetailsMap = new Map<string, any>();

    // Map user details by userId
    userDetailsSnapshot.forEach(doc => {
      const userDoc = doc.data();
      userDetailsMap.set(userDoc.uid, {
        uid: userDoc.uid,
        displayName: userDoc.displayName || 'Unknown',
        avatarUrl: userDoc.avatarUrl,
        email: userDoc.email,
        phoneNumber: userDoc.phoneNumber,
        password: userDoc.password,
        status: userDoc.status || 'unknown',
        totalPosts: 0 // Will be updated later
      });
    });

    // Update totalPosts in user details
    const topUserDetails = topUsers.map(user => {
      const userDetail = userDetailsMap.get(user.userId);
      if (userDetail) {
        userDetail.totalPosts = user.totalPosts;
        return userDetail;
      }
      return {
        uid: user.userId,
        displayName: 'Unknown',
        avatarUrl: '',
        email: '',
        phoneNumber: '',
        password: '',
        status: 'unknown',
        totalPosts: user.totalPosts
      };
    });

    return topUserDetails;

  } catch (error) {
    console.error('Error fetching top users by post count:', error);
    return [];
  }
}

