import axios from "axios";
import { UserCreationRequest, UserUpdateRequest } from "./dto/request_types";
import { ApiResponse, UserResponse } from "./dto/response_types";

class UserData {
    private static apiUrl = 'http://localhost:8080/users'; // Base URL for user-related API

    // Create a new user
    public static async createUser(request: UserCreationRequest): Promise<UserResponse> {
        const response = await axios.post<ApiResponse>(this.apiUrl, request);
        if (response.data.code === 0) {
            return response.data.result; // Assuming your ApiResponse has a 'result' field
        } else {
            throw new Error('Error creating user'); // Handle error as needed
        }
    }

    // Get all users
    public static async getUsers(): Promise<UserResponse[]> {
        const response = await axios.get<ApiResponse>(this.apiUrl);
        if (response.data.code === 0) {
            return response.data.result;
        } else {
            throw new Error('Error fetching users'); // Handle error as needed
        }
    }

    // Get a user by UID
    public static async getUserById(uid: string): Promise<UserResponse> {
        const response = await axios.get<ApiResponse>(`${this.apiUrl}/${uid}`);
        if (response.data.code === 0) {
            return response.data.result; // Assuming your ApiResponse has a 'result' field
        } else {
            throw new Error(`Error fetching user with uid: ${uid}`); // Handle error as needed
        }
    }

    // Check if an email exists
    public static async checkEmailExist(email: string): Promise<UserResponse> {
        const response = await axios.get<ApiResponse>(`${this.apiUrl}/email-exist/${email}`);
        if (response.data.code === 0) {
            return response.data.result; // Assuming your ApiResponse has a 'result' field
        } else {
            throw new Error(`Error checking email existence: ${email}`); // Handle error as needed
        }
    }

    // Get current user's info
    public static async getMyInfo(): Promise<UserResponse> {
        const response = await axios.get<ApiResponse>(`${this.apiUrl}/my-info`);
        if (response.data.code === 0) {
            return response.data.result; // Assuming your ApiResponse has a 'result' field
        } else {
            throw new Error('Error fetching user info'); // Handle error as needed
        }
    }

    // Update a user by UID
    public static async updateUser(uid: string, request: UserUpdateRequest): Promise<UserResponse> {
        const response = await axios.put<ApiResponse>(`${this.apiUrl}/${uid}`, request);
        if (response.data.code === 0) {
            return response.data.result; // Assuming your ApiResponse has a 'result' field
        } else {
            throw new Error(`Error updating user with uid: ${uid}`); // Handle error as needed
        }
    }

    // Delete a user by UID
    public static async deleteUser(uid: string): Promise<string> {
        const response = await axios.delete<ApiResponse>(`${this.apiUrl}/${uid}`);
        if (response.data.code === 0) {
            return response.data.result; // Assuming your ApiResponse has a 'result' field
        } else {
            throw new Error(`Error deleting user with uid: ${uid}`); // Handle error as needed
        }
    }
}

// You can call the static methods like this now:
// await UserData.getUsers();
// Export the class for use in your components
export default UserData;
