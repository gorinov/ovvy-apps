import React, {useState} from 'react';
import {ICompanyImage} from '../../model/dto/company';
import Alert from "@mui/material/Alert/Alert";
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import ClearIcon from '@mui/icons-material/Clear';
import Button from "@mui/material/Button/Button";

export const Gallery = ({ company, setCompany }) => {
    const [error, setError] = useState<string>('');
    const maxFileSize: number = 3072;

    const setMainImage = (index: number): void => {
        setCompany({
            ...company,
            images: company.images.map((image, currentIndex) => {
                image.main = index === currentIndex;

                return image;
            })
        });
    };

    const addImage = (image: ICompanyImage) => {
        setCompany(prevCompany => {
            const hasMain: boolean = !!prevCompany.images.find((image: ICompanyImage) => image.main);

            if (!hasMain) {
                image.main = true;
            }

            return {
                ...prevCompany,
                images: [...prevCompany.images, image]
            }
        });
    };

    const removeImage = (index: number): void => {
        let images = company.images.filter((image, currentIndex) => index !== currentIndex);

        if (!images.find(image => image.main) && images.length) {
            images[0].main = true;
        }

        setCompany({
            ...company,
            images: images
        });
    };

    const onFileChange = (e): void => {
        let files = e.target.files || e.dataTransfer.files;

        setError('');

        if (!files.length)
            return;

        for (let file of files){
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
        }
    };

    const createImage = (file: Blob): void => {
        let reader = new FileReader();

        reader.onload = (e) => addImage({src: e.target.result} as ICompanyImage);

        reader.readAsDataURL(file);
    };

    return (
        <div className='ov-form__images'>
            <div className="ov-form__images-list">
                { company.images && company.images.map((image: ICompanyImage, index: number) =>
                    <div className="ov-form__image" key={index}>
                        <div className="ov-form__image-picture" style={{backgroundImage: `url(${image.src})`}}/>
                        <ClearIcon onClick={() => removeImage(index)} className="ov-form__image-remove"/>
                        <div onClick={() => setMainImage(index)} className={`ov-form__image-control${image.main ? ' -active' : ''}`}>
                            {image.main ? 'Фотография анонса' : 'Сделать фотографией анонса'}
                        </div>
                    </div>
                ) }
            </div>

            { error && <Alert className="ov-app__inner-alert" onClose={() => setError('')} severity="error">{ error }</Alert> }

            <div className="ov-form__images-loader">
                <div className="ov-form__images-caption">
                    Качественные фотографии привлекут больше гостей
                    <label className="ov-form__images-subcaption">Загрузите не меньше 3 фотографий</label>
                </div>

                <input
                    accept="image/*"
                    id="images"
                    multiple
                    type="file"
                    hidden
                    onChange={onFileChange}
                />
                <label htmlFor="images">
                    <Button variant="contained" color="secondary" component="span" startIcon={<PhotoCameraIcon/>}>
                        Добавить фотографии
                    </Button>
                </label>
            </div>
        </div>
    );
};

export default Gallery;