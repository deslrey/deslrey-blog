import React, { useEffect, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import {
    Button,
    TextField,
    Autocomplete,
    Chip,
    Popper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import styles from './index.module.scss';
import type { Category, Tag } from '../../../interfaces';
import request from '../../../utils/request';
import { Message } from '../../../utils/message';
import { addArticleApi } from '../../../api/adminApi';
import { useNavigate } from 'react-router-dom';

const CustomPopper = styled(Popper)({
    '& .MuiAutocomplete-listbox': {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        maxHeight: 'none',
    },
    '& .MuiAutocomplete-option': {
        padding: 0,
        backgroundColor: 'transparent !important',
        '&:hover': {
            backgroundColor: 'transparent !important',
        },
    },
});

const AddArticle: React.FC = () => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState<Category | null>(null);
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');

    const [categories, setCategories] = useState<Category[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);

    // 弹窗控制
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogType, setDialogType] = useState<'save' | 'draft' | null>(null);

    // 保存文章逻辑
    const handleSave = async () => {
        const payload = {
            title,
            content,
            category: category?.categoryTitle || null,
            tagIdList: selectedTagIds,
            des: description,
        };

        try {
            const res = await request.post(addArticleApi.addArticle, payload);
            if (res.code !== 200) {
                Message.error(res.message);
                return;
            }
            resetForm();
            Message.success(res.message);
        } catch (error) {
            Message.error('保存失败');
        }
    };

    // 存为草稿逻辑
    const handleDraft = async () => {
        const draft = { title, content, des: description };
        try {
            const res = await request.post(addArticleApi.addDraft, draft);
            if (res.code !== 200) {
                Message.error(res.message);
                return;
            }
            resetForm();
            Message.success(res.message);
        } catch (error) {
            Message.error('保存草稿失败');
        }
    };

    const resetForm = () => {
        setTitle('');
        setCategory(null);
        setDescription('');
        setContent('');
        setSelectedTagIds([]);
    };

    const fetchCategories = async () => {
        try {
            const res = await request.get(addArticleApi.categoryArticleList);
            if (res.code === 200 && Array.isArray(res.data)) {
                setCategories(res.data);
            }
        } catch {
            setCategories([]);
        }
    };

    const fetchTags = async () => {
        try {
            const res = await request.get(addArticleApi.tagNameList);
            if (res.code === 200) {
                setTags(res.data);
            }
        } catch {
            setTags([]);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchTags();
    }, []);

    // 校验函数
    const validateForm = (type: 'save' | 'draft') => {
        if (type === 'save') {
            if (!title.trim()) {
                Message.warning('请输入文章标题');
                return false;
            }
            if (!category) {
                Message.warning('请选择文章分类');
                return false;
            }
            if (selectedTagIds.length === 0) {
                Message.warning('请选择至少一个标签');
                return false;
            }
            if (!description.trim()) {
                Message.warning('请输入文章描述');
                return false;
            }
            if (!content.trim()) {
                Message.warning('请输入文章内容');
                return false;
            }
            return true;
        } else {
            // 草稿只要有标题或内容即可
            if (!title.trim() && !content.trim()) {
                Message.warning('请至少填写标题或内容');
                return false;
            }
            return true;
        }
    };

    // 点击按钮时打开确认弹窗（加入校验）
    const openConfirmDialog = (type: 'save' | 'draft') => {
        if (!validateForm(type)) return; // 校验不通过直接return
        setDialogType(type);
        setOpenDialog(true);
    };


    // 确认操作
    const handleConfirm = () => {
        if (dialogType === 'save') {
            handleSave();
        } else if (dialogType === 'draft') {
            handleDraft();
        }
        setOpenDialog(false);
    };

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

            {/* 按钮区 */}
            <div className={styles.butBox}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => openConfirmDialog('save')}
                >
                    保存文章
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => openConfirmDialog('draft')}
                >
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

            {/* 确认弹窗 */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle sx={{ textAlign: 'center' }}>确认操作</DialogTitle>
                <DialogContent sx={{ textAlign: 'center', mt: 1 }}>
                    {dialogType === 'save'
                        ? '是否确定要保存文章？'
                        : '是否确定要存为草稿？'}
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 2 }}>
                    <Button variant="outlined" onClick={() => setOpenDialog(false)}>
                        取消
                    </Button>
                    <Button variant="contained" onClick={handleConfirm}>
                        确定
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default AddArticle;
