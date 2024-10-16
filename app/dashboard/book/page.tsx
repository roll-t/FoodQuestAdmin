"use client"
import ImageApi from "@/app/lib/api/image_api";
import BookData from "@/app/lib/data/book_data";
import { BooDataResponse } from "@/app/lib/data/dto/response_types";
import { HandleDateFormat } from "@/app/lib/helper/handle_date_format";
import styles from "@/app/ui/book/book.module.css";
import Loading from "@/app/ui/dashboard/loading/loading";
import Search from "@/app/ui/dashboard/search/search";
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

interface BookPageProps {
    addFunction?: boolean
}

const BookPage = ({ addFunction = true }: BookPageProps) => {
    const [booksData, setBooksData] = useState<BooDataResponse[]>([]);
    const [filteredBooks, setFilteredBooks] = useState<BooDataResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [booksPerPage] = useState(10);
    const fetchBooksData = async () => {
        setLoading(true);
        try {
            const listBookData = await BookData.getBooks();
            setBooksData(listBookData);
            setFilteredBooks(listBookData); // Khởi tạo danh sách tìm kiếm
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooksData();
    }, []);

    // Tính toán sách hiển thị cho trang hiện tại
    const indexOfLastBook = currentPage * booksPerPage; // Chỉ số cuối của sách trên trang hiện tại
    const indexOfFirstBook = indexOfLastBook - booksPerPage; // Chỉ số đầu của sách trên trang hiện tại
    const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook); // Sách hiển thị

    // Thay đổi trang
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const totalPages = Math.ceil(filteredBooks.length / booksPerPage); // Tổng số trang


    const handleDeleteBook = async (bid: string, imageUrl: string) => {
        setLoading(true);
        const allow = confirm("Bạn có chắc muốn xóa sách này?");
        if (allow) {
            const response = await BookData.deleteBookData(bid);
            await ImageApi.handleDelete(imageUrl);
            if (response.code === 0) {
                if (response.result) {
                    toast.success("Xóa sách thành công");
                    fetchBooksData();
                } else {
                    toast.error("Truyện đang chứa chapter không thể xóa");
                }
            } else {
                toast.error("Lỗi không thể xóa");
            }
        }
        setLoading(false);
    };

    // Hàm loại bỏ dấu tiếng Việt
    const removeAccents = (str: string): string => {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D");
    };

    // Hàm tìm kiếm không dấu
    const handleSearch = (query: string) => {
        const normalizedQuery = removeAccents(query.toLowerCase());
        const filtered = booksData.filter(book =>
            removeAccents(book.name.toLowerCase()).includes(normalizedQuery)
        );
        setFilteredBooks(filtered);
    };
    // Hàm tạo danh sách các nút phân trang
    const renderPaginationButtons = () => {
        const buttons = [];
        const maxButtons = 5; // Số nút phân trang tối đa hiển thị

        // Tính toán các nút hiển thị
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + maxButtons - 1);

        // Điều chỉnh startPage nếu không đủ số nút hiển thị
        if (endPage - startPage < maxButtons - 1) {
            startPage = Math.max(1, endPage - (maxButtons - 1));
        }

        // Tạo các nút phân trang
        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <button
                    key={i}
                    onClick={() => paginate(i)}
                    className={`${styles.paginationItems} ${currentPage === i ? styles.active : ""}`}
                >
                    {i}
                </button>
            );
        }

        return buttons;
    };

    return (
        <div className={styles.container}>
            {addFunction && (
                <div className={styles.head}>
                    <div>
                        <Search onSearch={handleSearch} />
                    </div>
                    <Link href={"/dashboard/book/add"}>
                        <button className={`${styles.button} ${styles.add}`}>
                            Thêm sách
                        </button>
                    </Link>
                </div>
            )}
            {loading ? (
                <div><Loading /></div>
            ) : (
                <>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <td>Bìa</td>
                                <td>Tiêu đề</td>
                                <td>Trạng thái</td>
                                <td>Cập nhật</td>
                                <td>Hoạt động</td>
                            </tr>
                        </thead>
                        <tbody>
                            {currentBooks.length > 0 ? (
                                currentBooks.map((book, index) => (
                                    <tr key={index}>
                                        <td>
                                            <div className={styles.bookCover}>
                                                <img src={book.thumbUrl || "/product.png "} alt="" width={60} height={70} />
                                            </div>
                                        </td>
                                        <td className={styles.titleCol}>
                                            {book.name || "Untitled"}
                                        </td>
                                        <td>{book.status}</td>
                                        <td>{HandleDateFormat.dateVN(book.updatedAt)}</td>
                                        <td>
                                            <div className={styles.btns}>
                                                <Link href={"/dashboard/book/" + book.bookDataId}>
                                                    <button className={`${styles.button} ${styles.view}`}>
                                                        Chi tiết
                                                    </button>
                                                </Link>
                                                <Link href={"/dashboard/book/edit/" + book.bookDataId}>
                                                    <button className={`${styles.button} ${styles.edit}`}>
                                                        sửa
                                                    </button>
                                                </Link>
                                                <button
                                                    className={`${styles.button} ${styles.delete}`}
                                                    onClick={() => handleDeleteBook(book.bookDataId, book.thumbUrl)}
                                                >
                                                    Xóa
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5}>Không có danh mục nào</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <div className={styles.pagination}>
                        <button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`${styles.paginationItems} ${currentPage === 1 ? styles.disabled : ""}`}
                        >
                            &laquo;
                        </button>
                        {renderPaginationButtons()}
                        <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`${styles.paginationItems} ${currentPage === totalPages ? styles.disabled : ""}`}
                        >
                            &raquo;
                        </button>
                    </div>
                </>
            )}

        </div>
    );
};

export default BookPage;
