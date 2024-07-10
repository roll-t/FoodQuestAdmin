// Import các module cần thiết từ Firebase
import { collection, doc, getDoc, updateDoc, deleteDoc, getDocs, query, limit, where, startAfter, QuerySnapshot, DocumentData, getFirestore, orderBy } from 'firebase/firestore';
import { getStorage, ref, deleteObject } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import firebaseConfig from '../utils'; // Đảm bảo đường dẫn đúng

// Khởi tạo Firebase app và Firestore
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const storage = getStorage(app);

// Enum cho trạng thái bài viết
enum StatusPosts {
  active = 'active',
  waiting = 'waiting',
  error = 'error',
  private = 'private'
}




// Phương thức cập nhật trạng thái của nhà hàng
export async function updateRestaurantStatus(restaurantId: string, newStatus: StatusPosts): Promise<void> {
  try {
    // Tham chiếu đến document của nhà hàng
    const restaurantRef = doc(firestore, 'restaurants', restaurantId);

    // Cập nhật trường 'status'
    await updateDoc(restaurantRef, {
      status: newStatus
    });

    console.log(`Restaurant ${restaurantId} status updated to ${newStatus}`);
  } catch (error) {
    console.error('Error updating restaurant status: ', error);
    throw error;
  }
}

// Phương thức xóa nhà hàng và tất cả ảnh liên quan
export async function deleteRestaurantAndImages(restaurantId: string): Promise<void> {
  try {
    // Tham chiếu đến document của nhà hàng
    const restaurantRef = doc(firestore, 'restaurants', restaurantId);

    // Lấy dữ liệu của nhà hàng để xác định các ảnh liên quan
    const docSnapshot = await getDoc(restaurantRef);
    if (!docSnapshot.exists()) {
      throw new Error('Restaurant not found');
    }

    const restaurantData = docSnapshot.data();
    const { avatarUrl, backgroundUrl, licenseRestaurant = [], onwnerLicenseImages = [] } = restaurantData;

    // Xóa tất cả các ảnh liên quan từ Firebase Storage
    const imageUrls = [avatarUrl, backgroundUrl, ...licenseRestaurant, ...onwnerLicenseImages].filter(url => url);
    await Promise.all(imageUrls.map(async (url: string) => {
      const imageRef = ref(storage, url);
      try {
        await deleteObject(imageRef);
        console.log(`Deleted image at ${url}`);
      } catch (error) {
        console.error(`Failed to delete image at ${url}: `, error);
      }
    }));

    // Xóa document của nhà hàng từ Firestore
    await deleteDoc(restaurantRef);
    console.log(`Restaurant ${restaurantId} deleted successfully`);
  } catch (error) {
    console.error('Error deleting restaurant and images: ', error);
    throw error;
  }
}
