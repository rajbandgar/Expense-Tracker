import React, { useRef, useState } from 'react';
import { LuUser, LuUpload, LuTrash } from 'react-icons/lu';
import { FaEdit } from "react-icons/fa";

const ProfilePhotoSelector = ({ image, setImage }) => {
    const inputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleImageChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            setImage(file);

            const preview = URL.createObjectURL(file);
            setPreviewUrl(preview);
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        setPreviewUrl(null);
    };

    const onChooseFile = () => {
        inputRef.current.click();
    };

    return (
        <div className='flex justify-center mb-6'>
            <input
                type='file'
                accept='image/*'
                ref={inputRef}
                onChange={handleImageChange}
                className='hidden'
            />

            {image ? (
                <div className='w-20 h-20 flex items-center justify-center bg-purple-600 rounded-full relative'>
                    <img
                        src={previewUrl}
                        alt='profile photo'
                        className=''
                    />
                    <button
                        type='button'
                        className=''
                        onClick={handleRemoveImage}
                    >
                        <FaEdit /></button>
                </div>
            ) : (
                <div className=''>
                    <LuUser className='w-20 h-20 flex items-center justify-center bg-purple-100 rounded-full relative' />
                    <button
                        type='button'
                        className=''
                        onClick={onChooseFile}
                    >
                        <LuUpload />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfilePhotoSelector;
