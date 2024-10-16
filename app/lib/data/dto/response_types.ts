


export interface ApiResponse {
    message: string;
    code: number;
    result: any
}

export interface BooDataResponse {
    bookDataId: string;
    name: string;
    slug: string;
    status: string;
    thumbUrl: string;
    subDocQuyen: boolean;
    categorySlug: string[];
    createdAt: string;
    updatedAt: string;
}

export const ApiResponseError: ApiResponse = {
    code: 999,
    result: null,
    message: ""
};

export interface TokenResponse {
    token: string,
    authenticated: boolean
}

export interface ChapterResponse{
    chapterId:string;
    chapterName:string;
    chapterTitle:string;
    createAt:string;
    chapterContent:string;
    bookDataId:string;
}

export interface JwtResponse{
    exp:number,
    iat:number,
    iss:string,
    jti:string,
    scope:string,
    sub:string,
    uid:string
}

// Interface cho quyền
export interface Permission {
    name: string; // Tên quyền
    description: string; // Mô tả quyền
}

// Interface cho vai trò
export interface Role {
    name: string; // Tên vai trò
    description: string; // Mô tả vai trò
    permissions: Permission[]; // Danh sách quyền
}

// Interface cho phản hồi người dùng
export interface UserResponse {
    uid: string; // UID của người dùng
    displayName: string; // Tên hiển thị
    email: string; // Email
    photoURL: string | null; // URL ảnh (có thể là null)
    creationTime: string; // Thời gian tạo
    roles: Role[]; // Danh sách vai trò
}

// Interface cho yêu cầu tạo người dùng
export interface UserCreationRequest {
    uid: string; // UID của người dùng
    displayName: string; // Tên hiển thị
    email: string; // Email
    photoURL?: string | null; // URL ảnh (tùy chọn)
    roles: Role[]; // Danh sách vai trò
}

// Interface cho yêu cầu cập nhật người dùng
export interface UserUpdateRequest {
    uid: string; // UID của người dùng
    displayName?: string; // Tên hiển thị (tùy chọn)
    email?: string; // Email (tùy chọn)
    photoURL?: string | null; // URL ảnh (tùy chọn)
    roles?: Role[]; // Danh sách vai trò (tùy chọn)
}