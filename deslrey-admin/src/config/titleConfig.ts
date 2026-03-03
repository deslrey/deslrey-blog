const titles = {
    Articles: '文章',
    About: '关于',
    Drafts: '草稿箱',
    AddArticle: '新建文章',
    EditArticle: '编辑文章',
    AboutMe: '关于我',
}

export type titleType = typeof titles[keyof typeof titles]