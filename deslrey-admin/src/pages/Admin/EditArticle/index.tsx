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
import { OperateType, type ArticleDraft, type Category, type Draft, type Folder, type Tag } from '../../../interfaces';
import request from '../../../utils/request';
import { Message } from '../../../utils/message';
import { useSearchParams } from 'react-router-dom';
import { editArticleApi, folderApi, imageApi } from '../../../api';

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

const EditArticle: React.FC = () => {

    //  路由接收参数
    const [searchParams] = useSearchParams()

    const operateType = searchParams.get('type')
    const operateId = searchParams.get('id')

    const [title, setTitle] = useState('');
    const [category, setCategory] = useState<Category | null>(null);
    const [folder, setFolder] = useState<Folder | null>(null)
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');

    const [categories, setCategories] = useState<Category[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
    const [folders, setFolders] = useState<Folder[]>([])

    //  弹窗状态
    const [openConfirmSave, setOpenConfirmSave] = useState(false);
    const [openConfirmDraft, setOpenConfirmDraft] = useState(false);

    //  校验函数
    const validateForm = (type: 'save' | 'draft') => {
        if (type === 'save') {
            if (!title.trim()) return Message.warning('请输入文章标题'), false;
            if (!category) return Message.warning('请选择文章分类'), false;
            if (selectedTagIds.length === 0) return Message.warning('请选择至少一个标签'), false;
            if (!description.trim()) return Message.warning('请输入文章描述'), false;
            if (!content.trim()) return Message.warning('请输入文章内容'), false;
            return true;
        } else {
            if (!title.trim() && !content.trim()) {
                Message.warning('请至少填写标题或内容');
                return false;
            }
            return true;
        }
    };

    //  点击保存按钮时，先弹出确认框
    const handleSaveClick = () => {
        if (validateForm('save')) setOpenConfirmSave(true);
    };

    //  点击存草稿按钮时，先弹出确认框
    const handleDraftClick = () => {
        if (validateForm('draft')) setOpenConfirmDraft(true);
    };

    //  确认保存
    const handleConfirmSave = async () => {
        setOpenConfirmSave(false);
        const payload = {
            id: '',
            title,
            content,
            category: category?.categoryTitle || null,
            tagIdList: selectedTagIds,
            des: description,
        };

        if (operateType === OperateType.article && operateId) {
            payload.id = operateId;
        }

        try {
            const res = await request.post(editArticleApi.addArticle, payload);
            if (res && res.code === 200) {
                Message.success(res.message);
                resetForm();
            } else {
                Message.error(res.message || '保存失败');
            }
        } catch {
            Message.error('保存失败');
        }
    };

    //  确认保存草稿
    const handleConfirmDraft = async () => {
        setOpenConfirmDraft(false);
        const payload = {
            id: '',
            title,
            content,
            des: description,
        };

        if (operateId) {
            payload.id = operateId;
        }


        try {
            const api = operateId
                ? editArticleApi.updateDraft   // 有 id = 更新草稿
                : editArticleApi.addDraft;     // 无 id = 新增草稿

            const res = await request.post(api, payload);
            if (res && res.code === 200) {
                Message.success(res.message);
                resetForm();
            } else {
                Message.error(res.message || '草稿保存失败');
            }
        } catch {
            Message.error('草稿保存失败');
        }
    };

    //  重置表单
    const resetForm = () => {
        setTitle('');
        setContent('');
        setDescription('');
        setCategory(null);
        setSelectedTagIds([]);
    };

    const fetchCategories = async () => {
        try {
            const res = await request.get(editArticleApi.categoryArticleList);
            if (res.code === 200 && Array.isArray(res.data)) {
                setCategories(res.data);
            }
        } catch (error) {
            setCategories([]);
        }
    };

    const fetchTags = async () => {
        try {
            const res = await request.get(editArticleApi.tagNameList);
            if (res.code === 200) {
                setTags(res.data);
            }
        } catch (error) {
            setTags([]);
        }
    };

    const fetchEditArticleData = () => {
        if (operateType === OperateType.article) {
            fetchArticleData()
        } else {
            fetchDraftData()
        }
    }

    const fetchArticleData = async () => {
        try {
            const res = await request.get<ArticleDraft>(`${editArticleApi.editArticle}/${operateId}`)
            if (res.code !== 200) {
                Message.warning(res.message)
                return
            }
            const data = res.data
            setTitle(data.title)
            setContent(data.content)
            setDescription(data.des)
            setCategory(data.category)
            setSelectedTagIds(data.tagIdList)
        } catch (error) {
            Message.error('获取数据失败')
        }
    }

    const fetchDraftData = async () => {
        try {
            const res = await request.get<Draft>(`${editArticleApi.draftDetail}/${operateId}`)
            if (res.code !== 200) {
                Message.warning(res.message)
                return
            }
            const data = res.data
            setTitle(data.title)
            setContent(data.content)
            setDescription(data.des)
        } catch (error) {
            Message.error('获取数据失败')
        }
    }

    const fetchFolders = async () => {
        try {
            const res = await request.get(folderApi.folderNameList);
            if (res.code == 200) {
                console.log(res.data)
                setFolders(res.data)
            }
        } catch (error) {
            setFolders([])
        }
    }

    useEffect(() => {
        fetchEditArticleData();
        fetchCategories();
        fetchTags();
        fetchFolders();
    }, []);

    const handlePaste = async (event: React.ClipboardEvent<HTMLDivElement>) => {
        if (!folder || !folder.id) {
            Message.warning("请先选择文件夹再粘贴上传图片");
            return;
        }

        const items = event.clipboardData.items;
        for (const item of items) {
            if (item.type.indexOf("image") !== -1) {
                event.preventDefault();
                const file = item.getAsFile();
                if (file) {
                    uploadImage(file);
                }
            }
        }
    };

    const uploadImage = async (file: File) => {
        if (!folder || !folder.id) {
            Message.warning("请先选择文件夹再上传图片");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("folderId", folder.id.toString());

        try {
            const res = await request.post(imageApi.uploadImage, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (res.code === 200) {
                const url = import.meta.env.VITE_IMAGE_API + res.data;
                insertToEditor(url);
            } else {
                Message.error(res.message);
            }
        } catch (error) {
            Message.error("上传失败");
        }
    };

    const insertToEditor = (url: string) => {
        if (!url) return;

        setContent((prev) =>
            prev + `\n\n![image](${url})\n`
        );
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

                {/* 文件夹选择 */}
                <Autocomplete
                    options={folders}
                    getOptionLabel={(option) => option.folderName}
                    value={folder}
                    onChange={(_, newValue) => setFolder(newValue)}
                    renderInput={(params) => (
                        <TextField {...params} label="文件夹" variant="outlined" fullWidth />
                    )}
                    noOptionsText="暂无选择"
                    fullWidth
                    clearOnBlur
                    PopperComponent={CustomPopper}
                    renderOption={(props, option) => (
                        <li {...props} key={option.id}>
                            <Chip label={option.folderName} />
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
                <Button variant="contained" color="primary" onClick={handleSaveClick}>
                    保存文章
                </Button>
                <Button variant="contained" color="primary" onClick={handleDraftClick}>
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
                    onPaste={(e) => {
                        handlePaste(e)
                    }}
                />
            </div>

            {/*  保存确认弹窗 */}
            <Dialog open={openConfirmSave} onClose={() => setOpenConfirmSave(false)}>
                <DialogTitle sx={{ textAlign: 'center' }}>确认保存</DialogTitle>
                <DialogContent sx={{ textAlign: 'center', mt: 1 }}>
                    确定要保存该文章吗？
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 2 }}>
                    <Button variant="outlined" onClick={() => setOpenConfirmSave(false)}>取消</Button>
                    <Button variant="contained" onClick={handleConfirmSave}>确定保存</Button>
                </DialogActions>
            </Dialog>

            {/*  草稿确认弹窗 */}
            <Dialog open={openConfirmDraft} onClose={() => setOpenConfirmDraft(false)}>
                <DialogTitle sx={{ textAlign: 'center' }}>确认保存草稿</DialogTitle>
                <DialogContent sx={{ textAlign: 'center', mt: 1 }}>
                    确定要保存为草稿吗？
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 2 }}>
                    <Button variant="outlined" onClick={() => setOpenConfirmDraft(false)}>取消</Button>
                    <Button variant="contained" onClick={handleConfirmDraft}>确定保存</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default EditArticle;
