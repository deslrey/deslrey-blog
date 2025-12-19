import { useEffect, useState } from "react";
import type { TocItem } from "../../interfaces";
import useNavStore from "../store/navStore";
import { getSectionInfoByH2 } from "../../utils/readingTitle";

export function useReadingTitle(
    articleTitle: string,
    toc: TocItem[],
    activeId: string | null
) {
    const setTitle = useNavStore(state => state.setTitle);
    const [atTop, setAtTop] = useState(true);

    // scroll
    useEffect(() => {
        const onScroll = () => {
            setAtTop(window.scrollY < 80);
        };

        onScroll();
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // title 
    useEffect(() => {
        if (atTop || !activeId) {
            setTitle(articleTitle);
            return;
        }

        const info = getSectionInfoByH2(toc, activeId);
        if (!info) {
            setTitle(articleTitle);
            return;
        }

        if (info.isMain) {
            setTitle(`${info.sectionNumber} / ${info.sectionTitle}`);
        } else {
            setTitle(`${info.sectionNumber} / ${info.currentTitle}`);
        }
    }, [atTop, activeId, toc, articleTitle]);
}
