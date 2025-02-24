// pages/index.jsx
import React, {useEffect, useState} from "react";
import Link from "next/link";
import { comma } from "../js/common";
import { foodCategoryArr } from "../utils/FoodCategoryArr";
const {
    getCategories,
    searchStore
} = require("../utils/userApi");

export default function Home() {
    const [categoriesData, setCategoriesData] = useState([]);
    const [storeList, setStoreList] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState("");

    const clickedCategory = (ele) => {
        if (ele === selectedCategory) {
            setSelectedCategory("");
        } else {
            setSelectedCategory(ele);
        }
    }

    const getPageNumbers = () => {
        let start = Math.max(1, page - 2);
        let end = Math.min(totalPages, start + 4);

        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }

    const fetchStoresList = async (pageNum) => {
        try {
            const storeName = search.trim() === "" ? null : search;
            const categoryName = selectedCategory.trim() === "" ? null : selectedCategory;
            const param = {
                page: pageNum - 1,
                size: 10,
                ...(storeName && { storeName }),
                ...(categoryName && { categoryName })
            }

            let res = await searchStore(param);

            if (res && res.data) {
                // 전체 페이지와 현제 페이지 세팅
                setTotalPages(res.data.page.totalPages);
                setPage(pageNum);
                setStoreList(res.data.content);
            }
            console.log(res.data);

        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ categoriesRes ] = await Promise.all([
                    getCategories(),
                ]);

                if (categoriesRes && categoriesRes.data && categoriesRes.data.content.length > 0) {
                    // 로컬 데이터 svg와 데이터베이스 카테고리 매핑 작업
                    const categories = categoriesRes.data.content.map(category => {
                        const match = foodCategoryArr.find(el => el.name === category.name);
                        return match ? {...category, ...match} : category;
                    })
                    setCategoriesData(categories);
                }
            } catch (e) {
                console.error("get data error : " + e);
            }
        }

        fetchData();
        fetchStoresList(1);
    }, [])

    return (
        <>
            <div className="container-sm mb-4">
                {/* 검색창 */}
                <div className="row m-3">
                    <div className="input-group d-flex justify-content-center align-items-center">
                        {/* 검색 인풋 */}
                        <input
                            type="search"
                            className="form-control col"
                            placeholder="오늘 뭐먹지?"
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                maxWidth: "720px",
                                height: "44px"
                            }}
                        />
                        {/* SVG 검색 아이콘 */}
                        <span
                            onClick={() => {fetchStoresList(1)}}
                            className="input-group-text"
                            style={{height: "44px", cursor: "pointer"}}
                        >
                        <img
                            src="/assets/icons/search.svg"
                            alt="search-icon"
                            style={{
                                maxWidth: "30px",
                                maxHeight: "30px",
                                width: "100%",
                                height: "auto"
                            }}
                        />
                    </span>
                    </div>
                </div>
                {/* 음식 카테고리 */}
                <div className="row justify-content-center">
                    {categoriesData.map((category) => (
                        <div className={`col text-center btn m-2 ${
                            selectedCategory === category.name ? "btn-primary" : ""
                        }`}
                             key={category.categoryId}
                             onClick={() => clickedCategory(category.name)}
                        >
                            <img
                                src={category.svg}
                                alt={category.name}
                                width={70}
                                height={70}
                            />
                            <p>{category.name}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="container-sm card p-2">
                {/* 음식 리스트 */}
                {storeList.map((store, index) => (
                    <div className="card m-3" key={index}>
                        {/* 식당 메뉴들이 보여질 공간 */}
                        <div
                            style={{
                                display: "flex",
                                gap: "10px",
                                overflowX: "scroll",
                                overflowY: "hidden",
                                whiteSpace: "nowrap", // 자식 요소들이 한 줄로 나열되도록 설정
                            }}
                        >
                            {/* 메뉴 카드: 반복 예시 */}
                            {[...Array(10)].map((_, index) => (
                                <div
                                    key={index}
                                    className="card m-2"
                                    style={{
                                        width: "120px",
                                        height: "120px",
                                        overflow: "hidden",
                                        flex: "0 0 auto", // 카드가 고정 너비를 가지며 스크롤에 영향을 받도록 설정
                                    }}
                                >
                                    <img
                                        src="https://picsum.photos/250/250"
                                        alt="test"
                                        style={{
                                            width: "120px",
                                            height: "120px",
                                            objectFit: "cover",
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="card-body">
                            {/* 식당 이름 */}
                            <Link href={`/store/${store.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                                <h5 className="card-title">
                                    {store.name}
                                    {/* 별점 */}
                                    <img
                                        src="/assets/icons/star.svg"
                                        alt="star-icon"
                                        style={{ width: "20px", height: "20px", margin: "0 0 5px 5px" }}
                                    />
                                    5
                                    {/*store.rate*/}
                                </h5>
                            </Link>
                            {/* 카테고리 정보 */}
                            <div
                                style={{
                                    display: "flex",
                                    gap: "5px",
                                    flexWrap: "wrap",
                                    marginBottom: "8px",
                                    overflowX: "auto",
                                }}
                            >
                                {store.categories.map((category, idx) => (
                                    <span
                                        key={idx}
                                        className="badge bg-primary"
                                        style={{
                                            padding: "5px 10px",
                                            fontSize: "12px",
                                            borderRadius: "12px",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {category}
                                    </span>
                                ))}
                            </div>
                            <p className="card-text">
                                <img
                                    src="/assets/icons/money.svg"
                                    alt="money-icon"
                                    style={{ width: "16px", height: "16px", margin: "0px 0px 5px 5px" }}
                                />
                                최소 주문: 24,000
                                {/*최소 주문: {comma(store.maximum_amount)}*/}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* 페이지네이션 */}
            <div className="container-sm my-4 d-flex justify-content-center align-items-center">
                <nav aria-label="Page navigation">
                    <ul className="pagination">
                        {/* 이전 버튼 */}
                        <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                            <button className="page-link"
                                    onClick={() => fetchStoresList(page - 1)}>
                                이전
                            </button>
                        </li>

                        {/* 페이지 번호 동적 생성 */}
                        {getPageNumbers().map((pageNum) => (
                            <li key={pageNum} className={`page-item ${pageNum === page ? "disabled" : ""}`}>
                                <button className="page-link" onClick={() => fetchStoresList(pageNum)}>
                                    {pageNum}
                                </button>
                            </li>
                        ))}

                        {/* 다음 버튼 */}
                        <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                            <button className="page-link"
                                    onClick={() => fetchStoresList(page + 1)}>
                                다음
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </>
    );
}
