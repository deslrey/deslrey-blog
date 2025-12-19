import type { TocItem } from "../interfaces";

export function getSectionInfoByH2(toc: TocItem[], activeId: string) {
    const index = toc.findIndex(item => item.id === activeId);
    if (index === -1) return null;

    for (let i = index; i >= 0; i--) {
        if (toc[i].level === 2) {
            const sectionNumber =
                toc.filter((item, idx) => item.level === 2 && idx <= i).length;

            return {
                sectionNumber,
                sectionTitle: toc[i].text,
                currentTitle: toc[index].text,
                isMain: toc[index].level === 2,
            };
        }
    }

    return null;
}
