import React from 'react';
import Link from "next/link";

export default function Master() {
    const btnClassName = "btn w-100 mb-3 "

    return (
        <div className="container-sm">
            <div className="row justify-content-center">
                <div className="col-md-7 card p-3">
                    <Link href="/master/create-store" className={btnClassName + "btn-warning"}>
                        가게 생성
                    </Link>
                </div>
            </div>
        </div>
    )
}