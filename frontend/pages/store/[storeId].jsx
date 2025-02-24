import React, { useEffect, useState } from 'react';
import {useRouter} from 'next/router';
import {comma} from "../../js/common";
const {
    getProducts,
    getOneStore,
    createOrder,
    createPay
} = require("../../utils/userApi");

export default function Store() {
    const prefix = "https://d2xo4zzrpvvhod.cloudfront.net/food/";

    const router = useRouter();
    const {storeId} = router.query;
    const [store, setStore] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [productList, setProductList] = useState([]);

    const [cart, setCart] = useState([]);

    const getPageNumbers = () => {
        let start = Math.max(1, page - 2);
        let end = Math.min(totalPages, start + 4);

        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }

    const addToCart = (menu) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find(item => item.id === menu.id);
            if (existingItem) {
                return prevCart.map((item) =>
                    item.id === menu.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                return [...prevCart, { ...menu, quantity: 1 }];
            }
        })
    }

    const removeFromCart = (id) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    };


    const truncateText = (text, length = 10) => {
        return text.length > length ? text.substring(0, length) + "..." : text;
    }

    const calculateTotalPrice = () => {
        return comma(cart.reduce((total, item) => total + item.price * item.quantity, 0));
    };

    const fetchProductsList = async (pageNum) => {
        if (!storeId) return;
        try {
            const param = {
                page: pageNum - 1,
                size: 12
            }

            let res = await getProducts(storeId, param);

            if (res && res.data) {
                setTotalPages(res.data.page.totalPages);
                setPage(pageNum);
                setProductList(res.data.content);
            }

            console.log(res);
        } catch (e) {
            console.log(e);
        }
    }

    const fetchStore = async () => {
        if (!storeId) return;

        try {
            let res = await getOneStore(storeId);

            if (res && res.data) {
                setStore(res.data);
            }
            console.log(res);
        } catch (e) {
            console.log(e);
        }
    }

    const handleOrderReq = async() => {
        try {
            const orderProducts = cart.map((item) => ({
                productId: item.id,
                productName: item.title,
                price: item.price,
                quantity: item.quantity
            }));

            const obj = {
                storeId: storeId,
                orderType: 1,
                storeName: store.name,
                address: store.storeAddress,
                products: orderProducts
            };

            console.log(obj);

            const res = await createOrder(obj);
            if (res && res.data) {

                const payObj = {
                    orderId: res.data.orderId,
                    paymentMethod: "NAVER_PAY",
                    amount: res.data.totalPrice,
                }

                const res2 = await createPay(payObj);

                if (res2 && res2.data) {
                    alert(res2.data.status);
                }

            }
        } catch (e) {
            console.log(e);
        }


    }

    useEffect(() => {
        if (!router.isReady) return;
        fetchProductsList(1);
        fetchStore();
    }, [router.isReady, storeId]);

    return (
        <>
            {store && (
                <div className="container mt-4">
                    <h2 className="mb-4 text-center">📋{store.name}</h2>
                    {/* 메뉴 리스트 */}
                    <div className="row g-3">
                        {productList.map((item) => (
                            <div key={item.id} className="col-md-2">
                                <div className="card shadow-sm">
                                    <img src={prefix + item.imageUrl} className="card-img-top" alt={item.title}/>
                                    <div className="card-body text-center">
                                        <h5 className="card-title">{item.title}</h5>
                                        <p className="card-text">{comma(item.price)} 원</p>
                                        <p className="card-text text-muted"
                                           title={item.comment}>{truncateText(item.comment)}</p>
                                        <button className="btn btn-success btn-sm" onClick={() => addToCart(item)}>
                                            담기
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 페이지네이션 */}
                    <div className="container-sm my-4 d-flex justify-content-center align-items-center">
                        <nav aria-label="Page navigation">
                            <ul className="pagination">
                                {/* 이전 버튼 */}
                                <li className={`page-item ${page === 1 ? "disabled" : ""}`}
                                    onClick={() => fetchProductsList(page - 1)}>
                                    <button className="page-link">
                                        이전
                                    </button>
                                </li>

                                {/* 페이지 번호 동적 생성 */}
                                {getPageNumbers().map((pageNum) => (
                                    <li key={pageNum} className={`page-item ${pageNum === page ? "disabled" : ""}`}>
                                        <button className="page-link" onClick={() => fetchProductsList(pageNum)}>
                                            {pageNum}
                                        </button>
                                    </li>
                                ))}

                                {/* 다음 버튼 */}
                                <li className={`page-item ${page === totalPages ? "disabled" : ""}`}
                                    onClick={() => fetchProductsList(page + 1)}>
                                    <button className="page-link">
                                        다음
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>

                    {/* 장바구니 */}
                    <div className="mt-5">
                        <h4>🛒 장바구니</h4>
                        {cart.length ===0 ? (
                            <p className="text-muted">장바구니가 비어있습니다.</p>
                        ) : (
                            <>
                                <table className="table table-hover mt-3">
                                    <thead className="table-light">
                                    <tr>
                                        <th>No,</th>
                                        <th>메뉴 이름</th>
                                        <th>가격 (원)</th>
                                        <th>수량</th>
                                        <th>삭제</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {cart.map((item, index) => (
                                        <tr key={item.id}>
                                            <td>{index + 1}</td>
                                            <td>{item.title}</td>
                                            <td className="text-primary">{item.price.toLocaleString()} 원</td>
                                            <td>{item.quantity}</td>
                                            <td>
                                                <button className="btn btn-danger btn-sm"
                                                        onClick={() => removeFromCart(item.id)}>
                                                    삭제
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                                <div className="d-flex justify-content-between align-items-center mt-3">
                                    <h5>총 가격: {calculateTotalPrice()} 원</h5>
                                    <button className="btn btn-primary" onClick={handleOrderReq}>결제하기</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}