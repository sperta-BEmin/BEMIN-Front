import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children }) => {
    return (
        <div className="d-flex flex-column vh-100">
            {/* 고정 네비게이션 바 */}
            <Navbar/>

            {/* 페이지별 콘텐츠가 들어가는 곳 */}
            <main>{children}</main>

            {/* 고정 푸터 */}
        </div>
    );
};

export default Layout;
