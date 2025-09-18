import React, { useEffect, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { Button, TextField, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import styles from './index.module.scss';
import type { Category } from '../../../interfaces';
import request from '../../../utils/request';

const AddArticle: React.FC = () => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');

    const [categories, setCategories] = useState<Category[]>([]);

    const handleSave = () => {
        console.log({ title, category, description, content });
    };

    const handleDraft = () => {
        console.log({ title, category, description, content });
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await request.get("/category/categoryList");
                if (res.code === 200 && Array.isArray(res.data)) {
                    setCategories(res.data);
                }
            } catch (error) {
                console.error("获取分类失败:", error);
                setCategories([])
            }
        };
        fetchCategories();
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
                <FormControl variant="outlined" fullWidth>
                    <InputLabel>分类</InputLabel>
                    <Select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        label="分类"
                    >
                        {categories.map((item) => (
                            <MenuItem key={item.id} value={item.categoryTitle}>
                                {item.categoryTitle}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
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
