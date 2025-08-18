import Footer from "@/components/Footer";
import Main from "@/components/Main";
import Nav from "@/components/Nav";
import React from "react";
import classNames from "classnames";
import styles from "./page.module.scss";

const Page: React.FC = () => {
    const bgClass = [styles.bg0, styles.bg1, styles.bg2];

    return (
        <div className={classNames(styles.PageBox, bgClass[0])}>
            <Nav />
            <Main />
            <Footer />
        </div>
    );
};

export default Page;
