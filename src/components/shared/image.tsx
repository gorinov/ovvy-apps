import React, {useState} from 'react';
import Alert from "@mui/material/Alert/Alert";
import Button from "@mui/material/Button/Button";
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

export const Image = ({ item, setItem }) => {
    const [error, setError] = useState<string>('');
    const maxFileSize: number = 3072;

    const addImage = (image: string) => {
        setItem({...item, image: image});
    };

    const onFileChange = (e): void => {
        let file = (e.target.files || e.dataTransfer.files)[0];

        setError('');

        let size = file.size / maxFileSize / maxFileSize;

        if (size > 1) {
            setError('Файл ' + file.name + ' слишком большой. Максимальный разрешенный размер 3МБ');
            return;
        }
        if (!file.type.match('image.*')) {
            setError('Файл ' + file.name + ' не является изображением');
            return;
        }

        createImage(file);
    };

    const createImage = (file: Blob): void => {
        let reader = new FileReader();

        reader.onload = (e) => addImage(e.target.result as string);

        reader.readAsDataURL(file);
    };

    return (
        <div className='ov-form__images -single'>
            { error && <Alert className="ov-app__inner-alert" onClose={() => setError('')} severity="error">{ error }</Alert> }

            <div className="ov-form__images-loader">
                { item.image && <div className="ov-form__image">
                    <div className="ov-form__image-picture" style={{backgroundImage: `url(${item.image})`}}/>
                </div>
                }
                <input
                    accept="image/*"
                    id="image"
                    type="file"
                    hidden
                    onChange={onFileChange}
                />
                <label htmlFor="image">
                    <Button variant="contained" color="secondary" component="span" startIcon={<PhotoCameraIcon/>}>
                        {item.image ? 'Изменить фотографию' : 'Добавить фотографию'}
                    </Button>
                </label>
            </div>
        </div>
    );
};

export default Image;