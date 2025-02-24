import React, { useEffect, useState } from 'react';
import {getOrderDetailsByOrderId, readOrder, getPay} from "../../../utils/userApi";
import {comma, localDateTrans} from "../../../js/common";

export default function MyList() {
    const [orderList, setOrderList] = useState([]);
    const [orderDetailList, setOrderDetailList] = useState([]);
    const [payment, setPayment] = useState(null);
    const [sortOrder, setSortOrder] = useState("desc");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchMyList = async (pageNum, sizeNum, sortOrder) => {
        try {
            let res = await readOrder({page: pageNum - 1, size: sizeNum, sortOrder});

            if (res) {
                console.log(res);
                const data = res.data.data;
                setPage(pageNum);
                setTotalPages(res.data.totalPages);
                setOrderList(data);
            }

        } catch (e) {
            console.log("리스트 데이터 로드 실패:", e)
        }
    }

    async function fetchOrderDetails(orderId) {
        try {
            const [ detailRes, payRes ] = await Promise.all([getOrderDetailsByOrderId(orderId), getPay(orderId)]);
            if (detailRes.error) {
                console.error("주문 상세 조회 실패:", detailRes.error);
            } else {
                setOrderDetailList(detailRes.data);
                console.log("주문 상세 데이터:", detailRes);
            }

            if (payRes.error) {
                console.error("결제 조회 실패:", payRes.error);
            } else {
                setPayment(detailRes.data);
                console.log("결제 상세 데이터:", payRes);
            }

        } catch (error) {
            console.error("API 요청 오류:", error);
        }
    }

    const toggleSortOrder = () => {
        const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
        setSortOrder(newSortOrder);
        fetchMyList(page, 5, newSortOrder);
    }

    function orderTypeConverter(code) {
        if (code === 1) {
            return "배달";
        } else if (code === 2) {
            return "포장"
        }
        return "Error";
    }

    function orderStatusConverter(code) {
        if (code === 0) return "주문취소";
        else if (code === 10) return "주문확인중...";
        else if (code === 11) return "조리중";
        else if (code === 20) return "배달중...";
        else if (code === 21) return "배달완료";
        else if (code === 30) return "포장완료";
        else if (code === 31) return "픽업완료";
        else return "Error";
    }

    const getPageNumbers = () => {
        let start = Math.max(1, page - 2);
        let end = Math.min(totalPages, start + 4);

        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }

    useEffect(() => {
        console.log(payment);
    }, [payment]);

    useEffect(() => {
        fetchMyList(1, 5);
    }, [])

    return (
        <>
            <div className="container-sm px-4 d-flex justify-content-between">
                <h2>주문 내역 조회</h2>
                <div className="form-check form-switch">
                    <label className="form-check-label" htmlFor="sortSwitch">
                        {sortOrder === "asc" ? "오래된순" : "최신순"}
                    </label>
                    <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="sortSwitch"
                        checked={sortOrder === "asc"} // asc이면 체크됨
                        onChange={toggleSortOrder}
                    />
                </div>
            </div>
            {orderList.length !== 0 ? (
                <div className="container-sm mt-4">
                    <div className="row">
                    {/* 왼쪽 List Group (6 컬럼) */}
                        <div className="col-md-6">
                            <div className="list-group">
                                {orderList.map((item, index) => (
                                    <div
                                        className="list-group-item list-group-item-action"
                                        key={index}
                                        style={{cursor: "pointer"}}
                                        onClick={() => fetchOrderDetails(item.orderId)}
                                    >
                                        <div className="d-flex w-100 justify-content-between mb-2">
                                            <h5 className="text-primary">{item.storeName}</h5>
                                            <small>{localDateTrans(item.createdAt)}</small>
                                        </div>
                                        <div className="d-flex w-100 justify-content-between">
                                            <p className="mb-2 text-danger">{orderTypeConverter(item.orderType)}</p>
                                            <p className="mb-2 text-success">{orderStatusConverter(item.orderStatus)}</p>
                                        </div>
                                        <small className="text-body-secondary">
                                            <img
                                                src="/assets/icons/dollar.svg"
                                                alt="dollar-icon"
                                                style={{width: "16px", height: "16px"}}
                                            />
                                            {comma(item.totalPrice)}
                                        </small>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 오른쪽 카드 (4 컬럼) - orderDetail이 있을 때만 렌더링 */}
                        {orderDetailList.length !== 0 && (
                            <div className="col-md-6">
                                <div className="card">
                                    <h3 className="card-header mb-4">주문 내역</h3>
                                    <div className="card-body">
                                        {orderDetailList.map((item, index) => (
                                            <div className="card-item mb-2" key={index}>
                                                <h5 className="card-text">{item.productName}</h5>
                                                <div className="d-flex w-100 justify-content-end">
                                                    <p className="card-text text-secondary">{comma(item.price)}</p>
                                                    <span className="mx-1 text-danger"> X </span>
                                                    <p className="card-text text-primary">{item.quantity}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="row d-flex justify-content-center align-items-center">
                    <div className="col-md-6 container card m-5 p-5 d-flex justify-content-center align-items-center">
                        <h1 className="text-secondary">주문 내역이 존재하지 않습니다.</h1>
                    </div>
                </div>
            )}
            {/*  페이지네이션 */}
            <div className="container-sm my-4 d-flex justify-content-center align-items-center">
                <nav aria-label="Page navigation">
                    <ul className="pagination">
                        {/* 이전 버튼 */}
                        <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                            <button className="page-link" onClick={() => fetchMyList(page - 1, 5, sortOrder)}>
                                이전
                            </button>
                        </li>

                        {/* 페이지 번호 동적 생성 */}
                        {getPageNumbers().map((pageNum) => (
                            <li key={pageNum} className={`page-item ${pageNum === page ? "disabled" : ""}`}>
                                <button className="page-link" onClick={() => fetchMyList(pageNum, 5, sortOrder)}>
                                    {pageNum}
                                </button>
                            </li>
                        ))}

                        {/* 다음 버튼 */}
                        <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                            <button className="page-link" onClick={() => fetchMyList(page + 1, 5, sortOrder)}>
                                다음
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </>
    );
}
