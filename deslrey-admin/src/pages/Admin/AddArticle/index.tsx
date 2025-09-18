import React, { useEffect, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import {
    Button,
    TextField,
    Autocomplete,
    Chip,
    Popper,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import styles from './index.module.scss';
import type { Category, Tag } from '../../../interfaces';
import request from '../../../utils/request';

const CustomPopper = styled(Popper)({
    '& .MuiAutocomplete-listbox': {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        maxHeight: 'none',
    },
    '& .MuiAutocomplete-option': {
        padding: 0,            // 去掉多余的 padding
        backgroundColor: 'transparent !important', // hover 背景透明
        '&:hover': {
            backgroundColor: 'transparent !important', // 禁用 hover 背景
        },
    },
});


const api = {
    categoryList: '/category/categoryList',
    tagNameList: '/tag/tagNameList',
};

const AddArticle: React.FC = () => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState<Category | null>(null);
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');

    const [categories, setCategories] = useState<Category[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);

    const handleSave = () => {
        console.log({
            title,
            categoryId: category?.id || null,
            tagIds: selectedTagIds,
            description,
            content,
        });
    };

    const handleDraft = () => {
        console.log({
            title,
            categoryId: category?.id || null,
            tagIds: selectedTagIds,
            description,
            content,
        });
    };

    const fetchCategories = async () => {
        try {
            const res = await request.get(api.categoryList);
            if (res.code === 200 && Array.isArray(res.data)) {
                setCategories(res.data);
            }
        } catch (error) {
            setCategories([]);
        }
    };

    const fetchTags = async () => {
        try {
            const res = await request.get(api.tagNameList);
            if (res.code === 200) {
                setTags(res.data);
            }
        } catch (error) {
            setTags([]);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchTags();
    }, []);

    return (
        <div className={styles.addArticleBox}>
            {/* 顶部输入区 */}
            <div className={styles.headerBox}>
                <TextField
                    label="文章标题"
                    variant="outlined"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                />
                {/* 分类选择 */}
                <Autocomplete
                    options={categories}
                    getOptionLabel={(option) => option.categoryTitle}
                    value={category}
                    onChange={(_, newValue) => setCategory(newValue)}
                    renderInput={(params) => (
                        <TextField {...params} label="分类" variant="outlined" fullWidth />
                    )}
                    noOptionsText="暂无选择"
                    fullWidth
                    clearOnBlur
                    PopperComponent={CustomPopper}
                    renderOption={(props, option) => (
                        <li {...props} key={option.id}>
                            <Chip label={option.categoryTitle} />
                        </li>
                    )}
                />


                {/* 标签选择（多选） */}
                <Autocomplete
                    multiple
                    options={tags}
                    getOptionLabel={(option) => option.tagTitle}
                    value={tags.filter((tag) => selectedTagIds.includes(tag.id))}
                    onChange={(_, newValue) => setSelectedTagIds(newValue.map((tag) => tag.id))}
                    renderInput={(params) => (
                        <TextField {...params} label="标签" variant="outlined" fullWidth />
                    )}
                    noOptionsText="暂无选择"
                    fullWidth
                    PopperComponent={CustomPopper}
                    renderOption={(props, option) => (
                        <li {...props} key={option.id}>
                            <Chip label={option.tagTitle} />
                        </li>
                    )}
                />
                <TextField
                    label="文章描述"
                    variant="outlined"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                />
            </div>

            <div className={styles.butBox}>
                <Button variant="contained" color="primary" onClick={handleSave}>
                    保存文章
                </Button>
                <Button variant="contained" color="primary" onClick={handleDraft}>
                    存为草稿
                </Button>
            </div>

            {/* Markdown 编辑器 */}
            <div className={styles.mdBox}>
                <MDEditor
                    value={content}
                    onChange={(value = '') => setContent(value)}
                    height="100%"
                    data-color-mode="light"
                />
            </div>
        </div>
    );
};

export default AddArticle;
