// pages/index.jsx
import React, { useState } from "react";
import { comma } from "../js/common";
import storeDataArr from '../temp_data/store_data.json';
import { foodCategoryArr } from "../utils/FoodCategoryArr";

export default function Home() {
    const [selectedCategory, setSelectedCategory] = useState(null);
    console.log(foodCategoryArr);

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
                            onChange={(e) => console.log(e.target.value)}
                            style={{
                                maxWidth: "720px",
                                height: "44px"
                            }}
                        />
                        {/* SVG 검색 아이콘 */}
                        <span
                            className="input-group-text"
                            style={{height: "44px"}}
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
                    {foodCategoryArr.map((category) => (
                        <div className={`col text-center btn m-2 ${
                            selectedCategory === category.id ? "btn-primary" : ""
                        }`}
                             key={category.id}
                             onClick={() => setSelectedCategory(category.id)}
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
                {storeDataArr.map((store, index) => (
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
                            <h5 className="card-title">
                                {store.name}
                                {/* 별점 */}
                                <img
                                    src="/assets/icons/star.svg"
                                    alt="star-icon"
                                    style={{ width: "20px", height: "20px", margin: "0 0 5px 5px" }}
                                />
                                {store.rate}
                            </h5>
                            <p className="card-text">
                                <img
                                    src="/assets/icons/dollar.svg"
                                    alt="dollar-icon"
                                    style={{ width: "16px", height: "16px", margin: "0 0 5px 5px" }}
                                />
                                배달 팁: {comma(store.tip)}
                                <img
                                    src="/assets/icons/money.svg"
                                    alt="money-icon"
                                    style={{ width: "16px", height: "16px", margin: "0px 0px 5px 5px" }}
                                />
                                최소 주문: {comma(store.maximum_amount)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
