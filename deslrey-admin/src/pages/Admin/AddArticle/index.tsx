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
    CircularProgress,
    FormHelperText,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import styles from './index.module.scss';
import type { Category, Folder, Tag } from '../../../types';
import request from '../../../utils/http';
import { Message } from '../../../utils/ui';
import { addArticleApi, folderApi, imageApi } from '../../../api';

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
    const [folder, setFolder] = useState<Folder | null>(null)
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');

    const [categories, setCategories] = useState<Category[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
    const [folders, setFolders] = useState<Folder[]>([])

    // 弹窗控制
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogType, setDialogType] = useState<'save' | 'draft' | null>(null);

    // 加载与提交状态
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const editorRef = React.useRef<HTMLDivElement>(null);


    // 保存文章逻辑
    const handleSave = async () => {
        const payload = {
            title,
            content,
            categoryId: category?.id || null,
            tagIdList: selectedTagIds,
            des: description,
        };

        setSaving(true);
        try {
            const res = await request.post(addArticleApi.addArticle, payload);
            if (res.code !== 200) {
                Message.error(res.message);
                return;
            }
            resetForm();
            Message.success(res.message);
        } catch (_error) {
            Message.error('保存失败');
        } finally {
            setSaving(false);
        }
    };

    // 存为草稿逻辑
    const handleDraft = async () => {
        const draft = { title, content, des: description };
        setSaving(true);
        try {
            const res = await request.post(addArticleApi.addDraft, draft);
            if (res.code !== 200) {
                Message.error(res.message);
                return;
            }
            resetForm();
            Message.success(res.message);
        } catch (_error) {
            Message.error('保存草稿失败');
        } finally {
            setSaving(false);
        }
    };

    const resetForm = () => {
        setTitle('');
        setCategory(null);
        setFolder(null);
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

    const fetchFolders = async () => {
        try {
            const res = await request.get(folderApi.folderNameList);
            if (res.code === 200 && res.data) {
                setFolders(res.data);
            }
        } catch {
            setFolders([]);
        }
    };

    useEffect(() => {
        setLoading(true);
        Promise.all([fetchCategories(), fetchTags(), fetchFolders()]).finally(() =>
            setLoading(false)
        );
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
            const res = await request.post(imageApi.uploadImage, formData);

            if (res?.code === 200 && res?.data != null) {
                const path = String(res.data);
                const url = (import.meta.env.VITE_IMAGE_API ?? "") + path;
                insertToEditor(url);
            } else {
                Message.error((res as { message?: string })?.message ?? "上传失败");
            }
        } catch (error: unknown) {
            const msg = (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message
                ?? (error as { message?: string })?.message
                ?? "上传失败";
            Message.error(msg);
        }
    };

    const insertToEditor = (url: string) => {
        if (!url) return;

        const insertText = `\n\n![image](${url})\n`;
        const editor = editorRef.current;
        const isDom = editor && typeof (editor as HTMLElement).querySelector === 'function';
        const textarea = isDom ? (editor as HTMLElement).querySelector('textarea') : null;

        if (textarea && typeof textarea.selectionStart === 'number') {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const before = content.substring(0, start);
            const after = content.substring(end);
            setContent(before + insertText + after);
            setTimeout(() => {
                textarea.selectionStart = textarea.selectionEnd = start + insertText.length;
                textarea.focus();
            }, 0);
        } else {
            setContent((prev) => prev + insertText);
        }
    };



    const wordCount = content.replace(/\s/g, '').length;
    const descLength = description.length;

    return (
        <div className={styles.addArticleBox}>
            {loading && (
                <div className={styles.loadingMask}>
                    <CircularProgress />
                    <span>加载分类、标签与文件夹…</span>
                </div>
            )}
            {/* 顶部输入区 */}
            <div className={styles.headerBox}>
                <TextField
                    label="文章标题"
                    placeholder="输入文章标题，建议简洁明了"
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

                {/* 文件夹选择（用于粘贴/上传图片的存放位置） */}
                <Autocomplete
                    options={folders}
                    getOptionLabel={(option) => option.folderName}
                    value={folder}
                    onChange={(_, newValue) => setFolder(newValue)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="图片文件夹"
                            variant="outlined"
                            fullWidth
                            placeholder="选择后可在编辑器中粘贴图片上传"
                        />
                    )}
                    noOptionsText="暂无文件夹，请先在图库中创建"
                    fullWidth
                    clearOnBlur
                    PopperComponent={CustomPopper}
                    renderOption={(props, option) => (
                        <li {...props} key={option.id}>
                            <Chip label={option.folderName} />
                        </li>
                    )}
                />
                {!folder && (
                    <FormHelperText sx={{ gridColumn: '1 / -1', mt: -1 }}>
                        选择「图片文件夹」后，在下方编辑器中可直接粘贴截图上传
                    </FormHelperText>
                )}

                <TextField
                    label="文章描述"
                    placeholder="简短描述文章内容，用于列表与摘要展示"
                    variant="outlined"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    multiline
                    minRows={2}
                    maxRows={4}
                    inputProps={{ maxLength: 200 }}
                    helperText={descLength > 0 ? `${descLength}/200 字` : '建议 200 字以内'}
                />
            </div>

            {/* 按钮区 */}
            <div className={styles.butBox}>
                <Button
                    variant="contained"
                    color="primary"
                    disabled={saving || loading}
                    onClick={() => openConfirmDialog('save')}
                    startIcon={saving ? <CircularProgress size={18} color="inherit" /> : null}
                >
                    {saving ? '保存中…' : '保存文章'}
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    disabled={saving || loading}
                    onClick={() => openConfirmDialog('draft')}
                    startIcon={saving ? <CircularProgress size={18} color="inherit" /> : null}
                >
                    {saving ? '保存中…' : '存为草稿'}
                </Button>
            </div>

            {/* Markdown 编辑器：用 div 包一层以便 ref 拿到 DOM，再在 insertToEditor 里 querySelector textarea */}
            <div className={styles.mdBox}>
                <div className={styles.editorHeader}>
                    <span className={styles.wordCount}>正文约 {wordCount} 字</span>
                </div>
                <div ref={editorRef} className={styles.editorWrap}>
                    <MDEditor
                        value={content}
                        onChange={(value = '') => setContent(value)}
                        height="100%"
                        data-color-mode="light"
                        onPaste={(e) => handlePaste(e)}
                    />
                </div>
            </div>

            {/* 确认弹窗 */}
            <Dialog open={openDialog} onClose={() => !saving && setOpenDialog(false)}>
                <DialogTitle sx={{ textAlign: 'center' }}>确认操作</DialogTitle>
                <DialogContent sx={{ textAlign: 'center', mt: 1 }}>
                    {dialogType === 'save'
                        ? '是否确定要保存文章？保存后将发布到前台列表。'
                        : '是否确定要存为草稿？可稍后继续编辑再发布。'}
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 2 }}>
                    <Button variant="outlined" onClick={() => setOpenDialog(false)} disabled={saving}>
                        取消
                    </Button>
                    <Button variant="contained" onClick={handleConfirm} disabled={saving}>
                        {saving ? '处理中…' : '确定'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default AddArticle;
